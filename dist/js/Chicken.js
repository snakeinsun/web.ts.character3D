"use strict";
class Chicken extends Character {
    constructor(canvas, xyPlaneDistance, camRadius) {
        super(canvas, xyPlaneDistance, camRadius, -90);
        this.states = {
            stand: {
                lines: [
                    { p1: "2, 2, 0", p2: "-2, -2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "2, -2, 0", p2: "-2, 2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "5, 8, 0", p2: "0, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, 11, 0 ", p2: "0, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, 5, 0", p2: "0, 8, 0 ", width: 1, color: "#ff0000" },
                    { p1: "5, -8, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, -11, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, -5, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "0, 8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "0, -8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "-8,0,25", p2: "8,0,25", width: 10, color: "#000000" },
                    { p1: "10,0,40", p2: "7,0,25", width: 3, color: "#000000" },
                    { p1: "12,0,42", p2: "15,0,42", width: 1, color: "#ff0000" }
                ],
                spheres: [
                    { p: "10,0,42", radius: 2, width: 1, color: "#000000", fill: "#ffffff" }
                ]
            },
            step_r: {
                lines: [
                    { p1: "2, 2, 0", p2: "-2, -2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "2, -2, 0", p2: "-2, 2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "10, 8, 0", p2: "5, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "10, 11, 0 ", p2: "5, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "10, 5, 0", p2: "5, 8, 0 ", width: 1, color: "#ff0000" },
                    { p1: "5, -8, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, -11, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, -5, 0", p2: "0, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, 8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "0, -8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "-8,0,25", p2: "8,0,25", width: 10, color: "#000000" },
                    { p1: "10,0,40", p2: "7,0,25", width: 3, color: "#000000" },
                    { p1: "12,0,42", p2: "15,0,42", width: 1, color: "#ff0000" }
                ],
                spheres: [
                    { p: "10,0,42", radius: 2, width: 1, color: "#000000", fill: "#ffffff" }
                ]
            },
            step_l: {
                lines: [
                    { p1: "2, 2, 0", p2: "-2, -2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "2, -2, 0", p2: "-2, 2, 0", width: 1, color: "#d6d6d6" },
                    { p1: "5, 8, 0", p2: "0, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, 11, 0 ", p2: "0, 8, 0", width: 1, color: "#ff0000" },
                    { p1: "5, 5, 0", p2: "0, 8, 0 ", width: 1, color: "#ff0000" },
                    { p1: "10, -8, 0", p2: "5, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "10, -11, 0", p2: "5, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "10, -5, 0", p2: "5, -8, 0", width: 1, color: "#ff0000" },
                    { p1: "0, 8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "5, -8, 0", p2: "0, 0, 25", width: 1, color: "#ff0000" },
                    { p1: "-8,0,25", p2: "8,0,25", width: 10, color: "#000000" },
                    { p1: "10,0,40", p2: "7,0,25", width: 3, color: "#000000" },
                    { p1: "12,0,42", p2: "15,0,42", width: 1, color: "#ff0000" }
                ],
                spheres: [
                    { p: "10,0,42", radius: 2, width: 1, color: "#000000", fill: "#ffffff" }
                ]
            },
        };
    }
}
//# sourceMappingURL=Chicken.js.map