let angle = 0;

let trueone: Character;


let bird: Chicken;
let birdstateindex = 0;
let bird_states = ["stand", "step_l", "stand", "step_r"];

function start1() {

    let w = new Walker();

    let canvas = <HTMLCanvasElement>document.getElementById("twCanvas");
    trueone = new Character(canvas, 60, 45, 90);
    trueone.x = 25;
    trueone.y = 25;
    trueone.autoClearPreviousDrawing = false;

    let canvas1 = <HTMLCanvasElement>document.getElementById("twChicken");
    bird = new Chicken(canvas1, 60, 30);
    bird.x = 44;
    bird.y = 44;
    bird.autoClearPreviousDrawing = true;
    bird.currentState = bird_states[0];

    document.onkeydown = keyDownHandler;

    setTimeout(() => {
        walk1();
    }, 666);





    setTimeout(() => {
        draw1();
    }, 15);
}



function walk1() {

    birdstateindex++;
    let sx = birdstateindex;
    sx = sx % bird_states.length;
    bird.currentState = bird_states[sx];



    setTimeout(() => {
        walk1();
    }, 77);
}

function keyDownHandler(e: KeyboardEvent) {
    if (e.keyCode == 38) {
        // up arrow
        let diff = Helper.turnABit(bird.angle, 270, 10);
        bird.angle = diff;
        bird.y = bird.y - 3;
    }
    else if (e.keyCode == 40) {
        // down arrow
        let diff = Helper.turnABit(bird.angle, 90, 10);
        bird.angle = diff;
        bird.y = bird.y + 3;
    }
    else if (e.keyCode == 37) {
        // left arrow
        let diff = Helper.turnABit(bird.angle, 180, 10);
        bird.angle = diff;
        bird.x = bird.x - 3;
    }
    else if (e.keyCode == 39) {
        // right arrow
        let diff = Helper.turnABit(bird.angle, 0, 10);
        bird.angle = diff;
        bird.x = bird.x + 3;
    }

}

function draw1() {

    trueone.clearDraw();
    trueone.angle++;



    angle = angle + 1;

    let Abody = `

L 5, 8, 0 > 0, 8, 0  -- foot
L 5, -8, 0 > 0, -8, 0  -- foot
L 5, 11, 0 > 0, 8, 0  -- foot
L 5, -11, 0 > 0, -8, 0  -- foot
L 5, 5, 0 > 0, 8, 0  -- foot
L 5, -5, 0 > 0, -8, 0  -- foot


L 0, 8, 0 > 0, 0, 20  -- leg
L 0, -8, 0 > 0, 0, 20  -- leg

L 10,0,20 > -10,0,20  --body
L 10,0,20 > 10,0,30  --body
L -10,0,20 > -10,0,30  --body
L -10,0,30 > 10,0,30  --body

L 10,0,40 > 10,0,30  --neck

L 12,0,42 > 15,0,42  --beak

C 10,0,42 R 2 -- head
       
       `;

    let lines = Abody
        .split("\n")
        .filter(l => l.trim() != "")
        .filter(l => l.startsWith("L"))
        .map(l => {
            l = l.substr(1);
            if (l.indexOf("--") != -1)
                l = l.substr(0, l.indexOf("--"));
            l = l.split(" ").join("");
            let pair = l.split(">");
            let coords1 = pair[0].split(",");
            let coords2 = pair[1].split(",");

            return new DrawingLine(
                parseFloat(coords1[0]), parseFloat(coords1[1]), parseFloat(coords1[2]),
                parseFloat(coords2[0]), parseFloat(coords2[1]), parseFloat(coords2[2]));
        });

    let spheres = Abody
        .split("\n")
        .filter(l => l.trim() != "")
        .filter(l => l.startsWith("C"))
        .map(l => {
            l = l.substr(1);
            if (l.indexOf("--") != -1)
                l = l.substr(0, l.indexOf("--"));
            l = l.split(" ").join("");
            let pair = l.split("R");
            let coords1 = pair[0].split(",");
            let radius = pair[1];

            return new DrawingSphere(
                parseFloat(coords1[0]), parseFloat(coords1[1]), parseFloat(coords1[2]), parseFloat(radius)
            );
        });


    let location = new Point(2, 3, 70);
    let radius = 30;
    location.x = location.x + radius * Math.cos((Math.PI / 180) * angle);
    location.y = location.y + radius * Math.sin((Math.PI / 180) * angle);

    let sightDirection = new Point(2, 3, 15);
    //sightDirection.x = sightDirection.x + radius * Math.cos((Math.PI / 180) * angle);
    //sightDirection.y = sightDirection.y + radius * Math.sin((Math.PI / 180) * angle);

    let supertop = new Point(2, 3, 300);
    let cam = new Camera(location, sightDirection, 101, supertop);

    let canvas = <HTMLCanvasElement>document.getElementById("myCanvase");
    var ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#FF0000";


    cam.clearPreviosDrawing(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cam.projectLines(canvas.width / 2, canvas.height / 2, ctx, lines);
    cam.projectSpheres(canvas.width / 2, canvas.height / 2, ctx, spheres);



    ctx.stroke();
    ctx.fill();

    setTimeout(() => {
        draw1();
    }, 15);
}