let numOfTogus = 8;
let toguses: Array<{ human: Walker, song: HTMLAudioElement }> = [];
let random = 100;
let fire: HTMLImageElement;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let destination = { x: 0, y: 0 };
let areSinging = false;


function start() {

    fire = <HTMLImageElement>document.getElementById("imgBonfire");
    canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");

    for (let i = 0; i < numOfTogus; i++) {
        let w = {
            human: new Walker(),
            song: new Audio('./sounds/song.mp3')
        };

        w.human.onStoppedWalk = () => {
            w.human.turnToPoint(destination);
            postponeTogusesToSing(w.human);
            joinSinging(w.human);
        };

        w.human.onStartedWalk = () => {
            stopSinging();
        };

        toguses.push(w);
    }

    reset();

    window.onresize = () => {
        reset();
    };
    canvas.onclick = (e) => {
        destination = { x: e.offsetX, y: e.offsetY };

        fire.style.left = `${e.offsetX - fire.width / 2}px`;
        fire.style.top = `${e.offsetY - fire.height / 2}px`;

        toguses.forEach((t) => {
            t.human.goto(e.offsetX + Math.floor(Math.random() * random) - random / 2, e.offsetY + Math.floor(Math.random() * random) - random / 2);
        });
    };
}

function reset() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    toguses.forEach((t, ix) => {
        if (ix == 0)
            t.human.goto(window.innerWidth / 2, window.innerHeight / 2);
        else
            t.human.goto(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    });
}

function postponeTogusesToSing(tx: Walker) {
    if (areSinging)
        return;

    areSinging = true;

    // postpone start
    setTimeout(() => {

        // a bit difference in start
        toguses.forEach((t) => {
            setTimeout(() => {
                t.song.volume = (t.human == tx ? 0.3 : 0);
                t.song.play();
                console.log("waiting to sing");
            }, Math.floor(Math.random() * 900) - 450);
        });

    }, Math.floor(Math.random() * 2) + 1);
}

function stopSinging() {
    toguses.forEach((t) => {
        t.song.volume = 0;
        t.song.pause();
        t.song.currentTime = 0;
        console.log("stopped sing");
    });
    areSinging = false;
}

function joinSinging(tx: Walker) {
    setTimeout(() => {
        let tg = toguses.find((t) => tx == t.human);
        if (tg) {
            console.log("joined sing");
            tg.song.volume = 0.3;
        }
    }, Math.floor(Math.random() * 5) + 1);
}