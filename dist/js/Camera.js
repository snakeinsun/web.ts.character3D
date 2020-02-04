"use strict";
class Convert {
    static numToString(value) {
        return "(" + (value < 0 ? "-" : "") + String(Math.round(Math.abs(value) * 1000) / 1000) + ")";
    }
}
class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return "(" + Convert.numToString(this.x) + ", " + Convert.numToString(this.y) + ", " + Convert.numToString(this.z) + ")";
    }
}
class Sphere extends Point {
    constructor(x, y, z, r) {
        super(x, y, z);
        this.r = r;
    }
    toString() {
        return "(" + Convert.numToString(this.x) + ", " + Convert.numToString(this.y) + ", " + Convert.numToString(this.z) + ")R=" + Convert.numToString(this.r);
    }
}
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromPoints(from, to) {
        return new Vector(to.x - from.x, to.y - from.y, to.z - from.z);
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    set length(value) {
        let mp = value / this.length;
        this.x = this.x * mp;
        this.y = this.y * mp;
        this.z = this.z * mp;
    }
    normalize() {
        let l = this.length;
        this.x = this.x / l;
        this.y = this.y / l;
        this.z = this.z / l;
    }
    static crossProduct(v1, v2) {
        let i = v1.y * v2.z - v1.z * v2.y;
        let j = -(v1.x * v2.z - v1.z * v2.x);
        let k = v1.x * v2.y - v1.y * v2.x;
        return {
            i: i,
            j: j,
            k: k
        };
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
}
class Plane {
    constructor(n, p) {
        this.toString = () => {
            let d = this.D;
            return "plot z=-(" + Convert.numToString(this.n.x) + "*x + " + Convert.numToString(this.n.y) + "*y + " + Convert.numToString(d) + ") / " + Convert.numToString(this.n.z) + "";
        };
        this.n = n;
        this.p = p;
    }
    get D() {
        return (-1) * ((this.n.x * this.p.x) + (this.n.y * this.p.y) + (this.n.z * this.p.z));
    }
    getIntersectionWithLine(line) {
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
    static from3Points(p, q, r) {
        let pq = Vector.fromPoints(p, q);
        let pr = Vector.fromPoints(p, r);
        let cp = Vector.crossProduct(pq, pr);
        let normalVector = new Vector(cp.i, cp.j, cp.k);
        return new Plane(normalVector, p);
    }
    static getIntersectionDirectionVector(p1, p2) {
        let cp = Vector.crossProduct(p1.n, p2.n);
        return new Vector(cp.i, cp.j, cp.k);
    }
}
class Rectangle2D {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}
class Line {
    constructor(x1, y1, z1, x2, y2, z2) {
        this.x1 = x1;
        this.y1 = y1;
        this.z1 = z1;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
    }
    static fromPoints(p1, p2) {
        return new Line(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
    static fromPointAndVector(p1, v) {
        return new Line(p1.x, p1.y, p1.z, p1.x + v.x, p1.y + v.y, p1.z + v.z);
    }
    get p1() {
        return new Point(this.x1, this.y1, this.z1);
    }
    get p2() {
        return new Point(this.x2, this.y2, this.z2);
    }
    getNearestPointOnLine(P) {
        let D = new Vector(this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1);
        D.normalize();
        let O = this.p1;
        let V = Vector.fromPoints(O, P);
        let d = Vector.dotProduct(V, D);
        let X = new Point(O.x + D.x * d, O.y + D.y * d, O.z + D.z * d);
        return X;
    }
    getDistanceToPoint(P) {
        let X = this.getNearestPointOnLine(P);
        let v = Vector.fromPoints(X, P);
        return v.length;
    }
    toString() {
        return "" + this.p1.toString() + " - " + this.p2.toString() + "";
    }
}
class DrawingLine extends Line {
    constructor() {
        super(...arguments);
        this.color = "#000000";
        this.width = 1;
    }
}
class DrawingSphere extends Sphere {
    constructor() {
        super(...arguments);
        this.color = "#000000";
        this.fill = "#ff0000";
        this.width = 1;
    }
}
class Camera {
    constructor(locationPoint, viewDirection, sceenDistance, superTop) {
        this.shift = 100000000;
        this._locationPoint = locationPoint;
        this._viewDirection = viewDirection;
        this._sceenDistance = sceenDistance;
        this._superTop = superTop;
        this._drawArea2D = new Rectangle2D(0, 0, 0, 0);
        this._updateMonitorPlane();
    }
    get locationPoint() { return this._locationPoint; }
    set locationPoint(value) {
        this._locationPoint = value;
        this._updateMonitorPlane();
    }
    get sceenDistance() { return this._sceenDistance; }
    set sceenDistance(value) {
        this._sceenDistance = value;
        this._updateMonitorPlane();
    }
    get viewDirection() { return this._viewDirection; }
    set viewDirection(value) {
        this._viewDirection = value;
        this._updateMonitorPlane();
    }
    get superTop() { return this._superTop; }
    set superTop(value) {
        this._superTop = value;
        this._updateMonitorPlane();
    }
    _updateMonitorPlane() {
        let normalVector = Vector.fromPoints(this._locationPoint, this._viewDirection);
        normalVector.length = this._sceenDistance;
        let planePoint = new Point(this._locationPoint.x + normalVector.x, this._locationPoint.y + normalVector.y, this._locationPoint.z + normalVector.z);
        this._monitorPlane = new Plane(normalVector, planePoint);
        this._verticalPlane = Plane.from3Points(this._superTop, this._locationPoint, this._viewDirection);
        let center = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, this._viewDirection));
        this._directionTop = Plane.getIntersectionDirectionVector(this._monitorPlane, this._verticalPlane);
        let directionHorizont = this._verticalPlane.n;
        directionHorizont.length = this.shift;
        this._directionTop.length = this.shift;
        let shiftedCenter = new Point(center.x + this._directionTop.x + directionHorizont.x, center.y + this._directionTop.y + directionHorizont.y, center.z + this._directionTop.z + directionHorizont.z);
        this._axis2DV = Line.fromPointAndVector(shiftedCenter, directionHorizont);
        this._axis2DH = Line.fromPointAndVector(shiftedCenter, this._directionTop);
    }
    clearPreviosDrawing(ctx) {
        ctx.clearRect(this._drawArea2D.x1, this._drawArea2D.y1, this._drawArea2D.x2 - this._drawArea2D.x1, this._drawArea2D.y2 - this._drawArea2D.y1);
        this._drawArea2D = null;
    }
    _extendDrawArea(x, y) {
        if (this._drawArea2D == null) {
            this._drawArea2D = new Rectangle2D(x, y, x + 1, y + 1);
        }
        this._drawArea2D.x1 = Math.min(this._drawArea2D.x1 - 1, x);
        this._drawArea2D.y1 = Math.min(this._drawArea2D.y1 - 1, y);
        this._drawArea2D.x2 = Math.max(this._drawArea2D.x2 + 1, x);
        this._drawArea2D.y2 = Math.max(this._drawArea2D.y2 + 1, y);
    }
    projectLines(screenPointX, screenPointY, ctx, lines) {
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
    projectSpheres(screenPointX, screenPointY, ctx, spheres) {
        spheres.forEach(s => {
            let pointOnMonitor1 = this._monitorPlane.getIntersectionWithLine(Line.fromPoints(this._locationPoint, s));
            let x = this._axis2DH.getDistanceToPoint(pointOnMonitor1);
            let y = -this._axis2DV.getDistanceToPoint(pointOnMonitor1);
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
//# sourceMappingURL=Camera.js.map