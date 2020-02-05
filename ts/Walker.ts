type StoppedWalkEvent = () => void;
type StartedWalkEvent = () => void;

class Walker {
    private _soundTap: HTMLAudioElement = new Audio('./sounds/tap.mp3');
    private _canvas: HTMLCanvasElement;
    private _character: InnerWalker;
    private _size = { w: 50, h: 50 };
    private _stepsize = 2;
    private _walking = false;

    public onStoppedWalk: StoppedWalkEvent;
    public onStartedWalk: StoppedWalkEvent;

    private characterStateIndex = 0;
    private characterStates = ["stand", "r1", "r2", "r3", "r2", "r1", "stand", "l1", "l2", "l3", "l2", "l1"];


    constructor() {
        this._canvas = <HTMLCanvasElement>document.createElement("canvas");
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

    private _desiredPos: { x: number, y: number, id: string };
    private _pos = { x: 0, y: 0 };
    goto(x: number, y: number) {

        this._desiredPos = {
            x: x,
            y: y,
            id: String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random())
        };

        this.makeAStep(this._desiredPos.id);
    }

    private makeAStep(id: string) {

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

            // movemnt
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

    public turnToPoint(p: { x: number, y: number }): void {
        let diff = {
            x: p.x - this._pos.x,
            y: p.y - this._pos.y
        };
        let angle = Math.atan2(diff.y, diff.x);
        angle = 180 * angle / Math.PI;
        let adiff = Helper.turnABit(this._character.angle, angle, 180);
        this._character.angle = adiff;
    }

    private getXYDiff() {
        let diff = {
            x: this._desiredPos.x - this._pos.x,
            y: this._desiredPos.y - this._pos.y
        };
        // normalize
        let vectorlen = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
        diff.x = diff.x / vectorlen;
        diff.y = diff.y / vectorlen;
        return diff;
    }

    private moveHTMLElement() {
        this._canvas.style.left = `${Math.floor(this._pos.x - this._size.w / 2)}px`;
        this._canvas.style.top = `${Math.floor(this._pos.y - this._size.h * (3 / 4))}px`;
    }




    keyDownHandler(e: KeyboardEvent) {
        if (e.keyCode == 38) {
            // up arrow
            let diff = Helper.turnABit(this._character.angle, 270, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 40) {
            // down arrow
            let diff = Helper.turnABit(this._character.angle, 90, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 37) {
            // left arrow
            let diff = Helper.turnABit(this._character.angle, 180, 10);
            this._character.angle = diff;
        }
        else if (e.keyCode == 39) {
            // right arrow
            let diff = Helper.turnABit(this._character.angle, 0, 10);
            this._character.angle = diff;
        }

    }

}

class InnerWalker extends Character {

    constructor(cnv: HTMLCanvasElement) {

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

            //@ts-ignore
            states[s.state] = {
                lines: [
                    { p1: `0, 0, 18`, p2: `0, 0, 25`, width: 4, color: `#000000` },  // body
                    { p1: `0, -2, 25`, p2: `0, 2, 25`, width: 2, color: `#000000` },  // shoulders


                    { p1: `0, -2, 25`, p2: `0, -4, 12`, width: 2, color: `#000000` },  // hand
                    { p1: `0, 2, 25`, p2: `0, 4, 12`, width: 2, color: `#000000` },  // hand

                    { p1: `0, -1, 18`, p2: `0, 1, 18`, width: 2, color: `#000000` },  // hips

                    { p1: `0, -1, 18`, p2: `${s.leftDiff}, -2, 0`, width: 2, color: `#000000` },  // leg left
                    { p1: `${s.leftDiff + 3}, -2, 0`, p2: `${s.leftDiff}, -2, 0`, width: 2, color: `#000000` },  // foot

                    { p1: `0, 1, 18`, p2: `${s.rigthDiff}, 2, 0`, width: 2, color: `#000000` }, // leg right
                    { p1: `${s.rigthDiff + 3}, 2, 0`, p2: `${s.rigthDiff}, 2, 0`, width: 2, color: `#000000` },  // foot

                    { p1: `- 7, 4, 12`, p2: `10, 4, 12`, width: 1, color: `#030303` }  // spear

                ],
                spheres: [
                    { p: `0, 0, 28`, radius: 1.7, width: 1, color: `#000000`, fill: `#ffff00` }  // head
                ]
            };

        });

        this.states = states;

        this.currentState = "stand";
    }

}