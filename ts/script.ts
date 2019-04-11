let angle = 0;

function start() {


    setTimeout(() => {
        draw();
    }, 15);
}


function draw() {



    angle = angle + 1;

    let Abody = `

L 5, 8, 0 > 0, 8, 0  -- foot
L 5, -8, 0 > 0, -8, 0  -- foot
L 5, 11, 0 > 0, 8, 0  -- foot
L 5, -11, 0 > 0, -8, 0  -- foot
L 5, 5, 0 > 0, 8, 0  -- foot
L 5, -5, 0 > 0, -8, 0  -- foot

L 0, 0, 10 > 0, 0, 20  -- dick, big dick

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

            return new Line(
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

            return new Sphere(
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

    let canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
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
        draw();
    }, 15);
}