class Character {
    constructor(canvas: HTMLCanvasElement, xyPlaneDistance: number, camRadius: number, anlgeShift: number) {

        this._angleShift = anlgeShift;
        this._stateNames = [];
        this._canvas = canvas;
        if (!this._states) {
            this._states = {
                stand: {
                    lines: [
                        { p1: "11,0,0", p2: "-11,0,0", width: 1, color: "#000000" },
                        { p1: "0,11,0", p2: "0,-11,0", width: 1, color: "#000000" },
                        { p1: "0,0,11", p2: "0,0,-11", width: 1, color: "#000000" }
                    ],
                    spheres: [
                        { p: "0,0,0", radius: 2, width: 1, color: "#000000", fill: "#ffffff" }
                    ]
                }
            };
        }

        this._parseStates();

        this._locationCenter = new Point(0, 0, xyPlaneDistance);
        this._radius = camRadius;

        let sightDirection = new Point(0, 0, 0);

        let supertop = new Point(2, 3, 300);
        this._camera = new Camera(this.location, sightDirection, 101, supertop);
        this._canvas = canvas;
        this._canvasCtx = canvas.getContext("2d");
    }

    private _stateNames: Array<string>;

    private _currentState: string = null;
    public get currentState(): string { return this._currentState; }
    public set currentState(value: string) {
        if (this._stateNames.indexOf(value) == -1)
            throw new Error('No such state (' + value + ')');

        if (this.autoClearPreviousDrawing)
            this._camera.clearPreviosDrawing(this._canvasCtx);
        this._currentState = value;
        this.redraw();
    }


    private _states: any = 0;
    protected get states(): any { return this._states; }
    protected set states(value: any) {
        this._states = value;
        this._parseStates();
    }



    protected _canvas: HTMLCanvasElement;
    protected _canvasCtx: CanvasRenderingContext2D;
    protected _camera: Camera;
    private _radius: number = 30;

    private _autoClearPreviousDrawing: boolean = true;
    public get autoClearPreviousDrawing(): boolean {
        return this._autoClearPreviousDrawing;
    }
    public set autoClearPreviousDrawing(value: boolean) {
        this._autoClearPreviousDrawing = value;
    }

    private _x: number = 0;
    public get x(): number { return this._x; }
    public set x(value: number) {
        if (this.autoClearPreviousDrawing)
            this._camera.clearPreviosDrawing(this._canvasCtx);
        this._x = value;
        this.redraw();
    }

    private _y: number = 0;
    public get y(): number { return this._y; }
    public set y(value: number) {
        if (this.autoClearPreviousDrawing)
            this._camera.clearPreviosDrawing(this._canvasCtx);
        this._y = value;
        this.redraw();
    }

    private _angleShift: number = 0;
    private _angle: number = 0;
    public get angle(): number { return this._angle; }
    public set angle(value: number) {
        if (this.autoClearPreviousDrawing)
            this._camera.clearPreviosDrawing(this._canvasCtx);
        this._angle = value;
        this.redraw();
    }

    public clearDraw() {
        this._camera.clearPreviosDrawing(this._canvasCtx);
    }

    protected redraw() {

        this._camera.locationPoint = this.location;

        let obj = this._states;
        let ctx = this._canvasCtx;
        let cam = this._camera;

        ctx.beginPath();

        let o = this.currentState;
        if (obj[o].hasOwnProperty("lines"))
            cam.projectLines(this.x, this.y, ctx, obj[o].actualLines);


        if (obj[o].hasOwnProperty("spheres"))
            cam.projectSpheres(this.x, this.y, ctx, obj[o].actualSpheres);

        ctx.stroke();
        ctx.fill();
    }

    private _locationCenter: Point;
    protected get location(): Point {
        let angle = this._angle + this._angleShift;
        angle = angle * (-1) + 360;
        return new Point(
            this._locationCenter.x + this._radius * Math.cos((Math.PI / 180) * (angle)),
            this._locationCenter.y + this._radius * Math.sin((Math.PI / 180) * (angle)),
            this._locationCenter.z);
    }



    private _parseStates() {
        let obj = this._states;

        this._stateNames = Object.keys(obj).map(o => String(o));
        this._currentState = this._stateNames[0];

        Object.keys(obj).forEach(o => {
            if (obj[o].hasOwnProperty("lines")) {
                obj[o].actualLines = obj[o].lines.map((ln: any) => {
                    let coords1 = ln.p1.split(" ").join("").split(",");
                    let coords2 = ln.p2.split(" ").join("").split(",");
                    let line = new DrawingLine(
                        parseFloat(coords1[0]), parseFloat(coords1[1]), parseFloat(coords1[2]),
                        parseFloat(coords2[0]), parseFloat(coords2[1]), parseFloat(coords2[2]));
                    if (ln.hasOwnProperty("width"))
                        line.width = ln.width;
                    if (ln.hasOwnProperty("color"))
                        line.color = ln.color;
                    return line;
                });
            }

            if (obj[o].hasOwnProperty("spheres")) {
                obj[o].actualSpheres = obj[o].spheres.map((ln: any) => {
                    let coords1 = ln.p.split(" ").join("").split(",");

                    let sphere = new DrawingSphere(
                        parseFloat(coords1[0]), parseFloat(coords1[1]), parseFloat(coords1[2]), parseFloat(ln.radius)
                    );

                    if (ln.hasOwnProperty("width"))
                        sphere.width = ln.width;
                    if (ln.hasOwnProperty("color"))
                        sphere.color = ln.color;
                    if (ln.hasOwnProperty("fill"))
                        sphere.fill = ln.fill;

                    return sphere;
                });
            }
        });
    }
}