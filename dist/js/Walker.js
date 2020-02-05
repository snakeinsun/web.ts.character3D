"use strict";
class Walker {
    constructor() {
        this._soundTap = new Audio('./sounds/tap.mp3');
        this._size = { w: 50, h: 50 };
        this._stepsize = 2;
        this._walking = false;
        this.characterStateIndex = 0;
        this.characterStates = ["stand", "r1", "r2", "r3", "r2", "r1", "stand", "l1", "l2", "l3", "l2", "l1"];
        this._pos = { x: 0, y: 0 };
        this._canvas = document.createElement("canvas");
        this._canvas.width = this._size.w;
        this._canvas.height = this._size.h;
        this._canvas.style.zIndex = "10";
        this._canvas.style.position = "absolute";
        this.moveHTMLElement();
        document.body.appendChild(this._canvas);
        this._character = new InnerWalker(this._canvas);
        this._character.x = this._canvas.width / 2;
        this._character.y = this._canvas.height * 3 / 4;
        document.onkeydown = this.keyDownHandler.bind(this);
    }
    goto(x, y) {
        this._desiredPos = {
            x: x,
            y: y,
            id: String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random())
        };
        this.makeAStep(this._desiredPos.id);
    }
    makeAStep(id) {
        if (id != this._desiredPos.id) {
            return;
        }
        if (Math.abs(this._pos.x - this._desiredPos.x) > 1 || Math.abs(this._pos.y - this._desiredPos.y) > 1) {
            let diff = this.getXYDiff();
            if (!this._walking)
                if (this.onStartedWalk)
                    this.onStartedWalk();
            this._walking = true;
            let angle = Math.atan2(diff.y, diff.x);
            angle = 180 * angle / Math.PI;
            diff.x = diff.x * this._stepsize;
            diff.y = diff.y * this._stepsize;
            let adiff = Helper.turnABit(this._character.angle, angle, 22);
            this._character.angle = adiff;
            this._pos.x += diff.x;
            this._pos.y += diff.y;
            this.moveHTMLElement();
            this.characterStateIndex++;
            let sx = this.characterStateIndex;
            sx = sx % this.characterStates.length;
            this._character.currentState = this.characterStates[sx];
            if (this._character.currentState == "l3" || this._character.currentState == "r3")
                this._soundTap.play();
            setTimeout(() => {
                this.makeAStep(id);
            }, 50);
        }
        else {
            this._character.currentState = "stand";
            if (this._walking)
                if (this.onStoppedWalk)
                    this.onStoppedWalk();
            this._walking = false;
        }
    }
    turnToPoint(p) {
        let diff = {
            x: p.x - this._pos.x,
            y: p.y - this._pos.y
        };
        let angle = Math.atan2(diff.y, diff.x);
        angle = 180 * angle / Math.PI;
        let adiff = Helper.turnABit(this._character.angle, angle, 180);
        this._character.angle = adiff;
    }
    getXYDiff() {
        let diff = {
            x: this._desiredPos.x - this._pos.x,
            y: this._desiredPos.y - this._pos.y
        };
        let vectorlen = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        diff.x = diff.x / vectorlen;
        diff.y = diff.y / vectorlen;
        return diff;
    }
    moveHTMLElement() {
        this._canvas.style.left = `${Math.floor(this._pos.x - this._size.w / 2)}px`;
        this._canvas.style.top = `${Math.floor(this._pos.y - this._size.h * (3 / 4))}px`;
    }
    keyDownHandler(e) {
        if (e.keyCode == 38) {
            let diff = Helper.turnABit(this._character.angle, 270, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 40) {
            let diff = Helper.turnABit(this._character.angle, 90, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 37) {
            let diff = Helper.turnABit(this._character.angle, 180, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 39) {
            let diff = Helper.turnABit(this._character.angle, 0, 10);
            this._character.angle = diff;
        }
    }
}
class InnerWalker extends Character {
    constructor(cnv) {
        super(cnv, 60, 50, -90);
        let steps = [
            { state: "stand", leftDiff: 0, rigthDiff: 0 },
            { state: "r1", leftDiff: -1, rigthDiff: 1 },
            { state: "r2", leftDiff: -3, rigthDiff: 3 },
            { state: "r3", leftDiff: -5, rigthDiff: 5 },
            { state: "l1", leftDiff: 1, rigthDiff: -1 },
            { state: "l2", leftDiff: 3, rigthDiff: -3 },
            { state: "l3", leftDiff: 5, rigthDiff: -5 }
        ];
        let states = {};
        steps.forEach((s) => {
            states[s.state] = {
                lines: [
                    { p1: `0, 0, 18`, p2: `0, 0, 25`, width: 4, color: `#000000` },
                    { p1: `0, -2, 25`, p2: `0, 2, 25`, width: 2, color: `#000000` },
                    { p1: `0, -2, 25`, p2: `0, -4, 12`, width: 2, color: `#000000` },
                    { p1: `0, 2, 25`, p2: `0, 4, 12`, width: 2, color: `#000000` },
                    { p1: `0, -1, 18`, p2: `0, 1, 18`, width: 2, color: `#000000` },
                    { p1: `0, -1, 18`, p2: `${s.leftDiff}, -2, 0`, width: 2, color: `#000000` },
                    { p1: `${s.leftDiff + 3}, -2, 0`, p2: `${s.leftDiff}, -2, 0`, width: 2, color: `#000000` },
                    { p1: `0, 1, 18`, p2: `${s.rigthDiff}, 2, 0`, width: 2, color: `#000000` },
                    { p1: `${s.rigthDiff + 3}, 2, 0`, p2: `${s.rigthDiff}, 2, 0`, width: 2, color: `#000000` },
                    { p1: `- 7, 4, 12`, p2: `10, 4, 12`, width: 1, color: `#030303` }
                ],
                spheres: [
                    { p: `0, 0, 28`, radius: 1.7, width: 1, color: `#000000`, fill: `#ffff00` }
                ]
            };
        });
        this.states = states;
        this.currentState = "stand";
    }
}
//# sourceMappingURL=Walker.js.map