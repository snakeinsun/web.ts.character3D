class Convert {
    static numToString(value: number) {
        return "(" + (value < 0 ? "-" : "") + String(Math.round(Math.abs(value) * 1000) / 1000) + ")";
    }
}

// http://www.songho.ca/math/plane/plane.html

class Point {
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public x: number;
    public y: number;
    public z: number;

    public toString(): string {
        return "(" + Convert.numToString(this.x) + ", " + Convert.numToString(this.y) + ", " + Convert.numToString(this.z) + ")";
    }
}

class Sphere extends Point {
    constructor(x: number, y: number, z: number, r: number) {
        super(x, y, z);

        this.r = r;
    }

    public r: number;

    public toString(): string {
        return "(" + Convert.numToString(this.x) + ", " + Convert.numToString(this.y) + ", " + Convert.numToString(this.z) + ")R=" + Convert.numToString(this.r);
    }
}


class Vector {
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public x: number;
    public y: number;
    public z: number;

    static fromPoints(from: Point, to: Point): Vector {
        return new Vector(to.x - from.x, to.y - from.y, to.z - from.z);
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    set length(value: number) {
        let mp = value / this.length;
        this.x = this.x * mp;
        this.y = this.y * mp;
        this.z = this.z * mp;
    }

    public normalize() {
        let l = this.length;
        this.x = this.x / l;
        this.y = this.y / l;
        this.z = this.z / l;
    }

    public static crossProduct(v1: Vector, v2: Vector): { [key: string]: any } {
        // http://tutorial.math.lamar.edu/Classes/CalcIII/EqnsOfPlanes.aspx

        let i = v1.y * v2.z - v1.z * v2.y;
        let j = -(v1.x * v2.z - v1.z * v2.x);
        let k = v1.x * v2.y - v1.y * v2.x;

        return {
            i: i,
            j: j,
            k: k
        };
    }

    public static dotProduct(v1: Vector, v2: Vector): number {
        // http://tutorial.math.lamar.edu/Classes/CalcIII/EqnsOfPlanes.aspx

        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }


}

class Plane {
    constructor(n: Vector, p: Point) {
        this.n = n;
        this.p = p;
    }

    public n: Vector;
    public p: Point;

    private get D(): number {
        return (-1) * ((this.n.x * this.p.x) + (this.n.y * this.p.y) + (this.n.z * this.p.z));
    }

    public toString = (): string => {
        let d = this.D;
        return "plot z=-(" + Convert.numToString(this.n.x) + "*x + " + Convert.numToString(this.n.y) + "*y + " + Convert.numToString(d) + ") / " + Convert.numToString(this.n.z) + "";
    }

    public getIntersectionWithLine(line: Line): Point {

        // http://www.ambrsoft.com/TrigoCalc/Line3D/Line3D_.htm#line3Dgeometry
        // http://www.ambrsoft.com/TrigoCalc/Plan3D/PlaneLineIntersection_.htm

        // line
        // x = line.x1 + a * t   z = line.z1 + a * t   z = line.z1 + a * t
        let a = (line.x2 - line.x1);
        let b = (line.y2 - line.y1);
        let c = (line.z2 - line.z1);

        let D = this.D;
        let A = this.n.x;
        let B = this.n.y;
        let C = this.n.z;

        let x = line.x1 - (a * (A * line.x1 + B * line.y1 + C * line.z1 + D)) / (A * a + B * b + C * c);
        let y = line.y1 - (b * (A * line.x1 + B * line.y1 + C * line.z1 + D)) / (A * a + B * b + C * c);
        let z = line.z1 - (c * (A * line.x1 + B * line.y1 + C * line.z1 + D)) / (A * a + B * b + C * c);

        return new Point(x, y, z);
    }

    public static from3Points(p: Point, q: Point, r: Point) {
        let pq = Vector.fromPoints(p, q);
        let pr = Vector.fromPoints(p, r);
        let cp = Vector.crossProduct(pq, pr);
        let normalVector = new Vector(cp.i, cp.j, cp.k);
        return new Plane(normalVector, p);
    }

    public static getIntersectionDirectionVector(p1: Plane, p2: Plane) {
        let cp = Vector.crossProduct(p1.n, p2.n);
        return new Vector(cp.i, cp.j, cp.k);
    }
}

class Rectangle2D {
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;
    }
    public x1: number;
    public y1: number;

    public x2: number;
    public y2: number;
}

class Line {
    constructor(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;

        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
    }

    static fromPoints(p1: Point, p2: Point): Line {
        return new Line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }

    static fromPointAndVector(p1: Point, v: Vector): Line {
        return new Line(p1.x, p1.y, p1.z, p1.x + v.x, p1.y + v.y, p1.z + v.z);
    }

    public x1: number;
    public y1: number;
    public z1: number;

    public x2: number;
    public y2: number;
    public z2: number;

    public get p1(): Point {
        return new Point(this.x1, this.y1, this.z1);
    }
    public get p2(): Point {
        return new Point(this.x2, this.y2, this.z2);
    }

    public getNearestPointOnLine(P: Point): Point {

        // https://stackoverflow.com/questions/52791641/distance-from-point-to-line-3d-formula

        let D = new Vector(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
        D.normalize();
        let O = this.p1;
        let V = Vector.fromPoints(O, P);
        let d = Vector.dotProduct(V, D);
        let X = new Point(O.x + D.x * d, O.y + D.y * d, O.z + D.z * d);

        return X;
    }

    public getDistanceToPoint(P: Point): number {

        let X = this.getNearestPointOnLine(P);
        let v = Vector.fromPoints(X, P);
        return v.length;
    }

    public toString(): string {
        return "" + this.p1.toString() + " - " + this.p2.toString() + "";
    }
}

class DrawingLine extends Line {
    public color: string = "#000000";
    public width: number = 1;
}

class DrawingSphere extends Sphere {
    public color: string = "#000000";
    public fill: string = "#ff0000";
    public width: number = 1;
}


class Camera {
    constructor(locationPoint: Point, viewDirection: Point, sceenDistance: number, superTop: Point) {
        this._locationPoint = locationPoint;
        this._viewDirection = viewDirection;
        this._sceenDistance = sceenDistance;
        this._superTop = superTop;

        this._drawArea2D = new Rectangle2D(0, 0, 0, 0);
        this._updateMonitorPlane();
    }

    private shift = 100000000;

    private _locationPoint: Point;
    public get locationPoint(): Point { return this._locationPoint; }
    public set locationPoint(value: Point) {
        this._locationPoint = value;
        this._updateMonitorPlane();
    }

    private _sceenDistance: number;
    public get sceenDistance(): number { return this._sceenDistance; }
    public set sceenDistance(value: number) {
        this._sceenDistance = value;
        this._updateMonitorPlane();
    }

    private _viewDirection: Point;
    public get viewDirection(): Point { return this._viewDirection; }
    public set viewDirection(value: Point) {
        this._viewDirection = value;
        this._updateMonitorPlane();
    }

    private _superTop: Point;
    public get superTop(): Point { return this._superTop; }
    public set superTop(value: Point) {
        this._superTop = value;
        this._updateMonitorPlane();
    }

    private _monitorPlane: Plane;
    private _verticalPlane: Plane;
    private _directionTop: Vector;

    private _axis2DV: Line;
    private _axis2DH: Line;

    private _updateMonitorPlane() {
        let normalVector = Vector.fromPoints(this._locationPoint, this._viewDirection);

        // dont care how long vector is, we make it sceenDistance length
        normalVector.length = this._sceenDistance;

        let planePoint = new Point(this._locationPoint.x + normalVector.x, this._locationPoint.y + normalVector.y, this._locationPoint.z + normalVector.z);

        this._monitorPlane = new Plane(normalVector, planePoint);

        this._verticalPlane = Plane.from3Points(this._superTop, this._locationPoint, this._viewDirection);


        let center = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, this._viewDirection));
        this._directionTop = Plane.getIntersectionDirectionVector(this._monitorPlane, this._verticalPlane);
        let directionHorizont = this._verticalPlane.n;
        directionHorizont.length = this.shift;
        this._directionTop.length = this.shift;

        let shiftedCenter = new Point(
            center.x + this._directionTop.x + directionHorizont.x,
            center.y + this._directionTop.y + directionHorizont.y,
            center.z + this._directionTop.z + directionHorizont.z
        );


        this._axis2DV = Line.fromPointAndVector(shiftedCenter, directionHorizont);
        this._axis2DH = Line.fromPointAndVector(shiftedCenter, this._directionTop);
    }

    private _drawArea2D: Rectangle2D;

    public clearPreviosDrawing(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(this._drawArea2D.x1, this._drawArea2D.y1, this._drawArea2D.x2 - this._drawArea2D.x1, this._drawArea2D.y2 - this._drawArea2D.y1);

        /*  ctx.beginPath();
          ctx.rect(this._drawArea2D.x1, this._drawArea2D.y1, this._drawArea2D.x2 - this._drawArea2D.x1, this._drawArea2D.y2 - this._drawArea2D.y1);
          ctx.stroke();
  */
        this._drawArea2D = null;
    }

    private _extendDrawArea(x: number, y: number) {
        if (this._drawArea2D == null) {
            this._drawArea2D = new Rectangle2D(x, y, x + 1, y + 1);
        }

        this._drawArea2D.x1 = Math.min(this._drawArea2D.x1 - 1, x);
        this._drawArea2D.y1 = Math.min(this._drawArea2D.y1 - 1, y);

        this._drawArea2D.x2 = Math.max(this._drawArea2D.x2 + 1, x);
        this._drawArea2D.y2 = Math.max(this._drawArea2D.y2 + 1, y);
    }

    public projectLines(screenPointX: number, screenPointY: number, ctx: CanvasRenderingContext2D, lines: Array<DrawingLine>) {
        lines.forEach(l => {
            let pointOnMonitor1 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, l.p1));
            let pointOnMonitor2 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, l.p2));
            let x = this._axis2DH.getDistanceToPoint(pointOnMonitor1);
            let y = -this._axis2DV.getDistanceToPoint(pointOnMonitor1);

            x = x - this.shift;
            y = y + this.shift;

            x = x + (screenPointX);
            y = y + (screenPointY);

            if (ctx.strokeStyle != l.color || ctx.lineWidth != l.width) {
                ctx.stroke();
                ctx.beginPath();
            }

            ctx.strokeStyle = l.color;
            ctx.lineWidth = l.width;

            ctx.moveTo(x, y);

            this._extendDrawArea(x, y);

            x = this._axis2DH.getDistanceToPoint(pointOnMonitor2);
            y = -this._axis2DV.getDistanceToPoint(pointOnMonitor2);

            x = x - this.shift;
            y = y + this.shift;

            x = x + (screenPointX);
            y = y + (screenPointY);

            ctx.lineTo(x, y);


            this._extendDrawArea(x, y);
        });
    }

    public projectSpheres(screenPointX: number, screenPointY: number, ctx: CanvasRenderingContext2D, spheres: Array<DrawingSphere>) {
        spheres.forEach(s => {
            let pointOnMonitor1 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, s));
            let x = this._axis2DH.getDistanceToPoint(pointOnMonitor1);
            let y = -this._axis2DV.getDistanceToPoint(pointOnMonitor1);

            // new radius
            let rv = new Vector(this._directionTop.x, this._directionTop.y, this._directionTop.z);
            rv.length = s.r;
            let pt2 = new Point(s.x + rv.x, s.y + rv.y, s.z + rv.z);
            let rp1 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, s));
            let rp2 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, pt2));
            rv = Vector.fromPoints(rp1, rp2);
            let r = rv.length;

            x = x - this.shift;
            y = y + this.shift;

            x = x + (screenPointX);
            y = y + (screenPointY);

            if (ctx.fillStyle != s.fill || ctx.strokeStyle != s.color || ctx.lineWidth != s.width) {
                ctx.fill();
                ctx.stroke();
                ctx.beginPath();
            }

            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.fill;
            ctx.lineWidth = s.width;



            ctx.moveTo(x, y);
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.moveTo(x, y);

            this._extendDrawArea(x - r, y - r);
            this._extendDrawArea(x + r, y + r);
        });
    }
}
