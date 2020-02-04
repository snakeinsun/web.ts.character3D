let toguses = 9;
let togu: Array<Walker> = [];
let random = 100;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let destination = { x: 0, y: 0 };


function start() {

    canvas = <HTMLCanvasElement>document.getElementById("mainCanvas");
    ctx = canvas.getContext("2d");


    for (let i = 0; i < toguses; i++) {
        let w = new Walker();

        w.onStopped = () => {
            w.turnToPoint(destination);
        };

        togu.push(w);
    }

    reset();

    window.onresize = () => {
        reset();
    };
    canvas.onclick = (e) => {
        destination = { x: e.offsetX, y: e.offsetY };

        togu.forEach((t) => {
            t.goto(e.offsetX + Math.floor(Math.random() * random) - random / 2, e.offsetY + Math.floor(Math.random() * random) - random / 2);
        });
    };
}

function reset() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    togu.forEach((t, ix) => {
        if (ix == 0)
            t.goto(window.innerWidth / 2, window.innerHeight / 2);
        else
            t.goto(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    });
}