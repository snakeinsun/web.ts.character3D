"use strict";
class Helper {
    static numToString(value) {
        return "(" + (value < 0 ? "-" : "") + String(Math.round(Math.abs(value) * 1000) / 1000) + ")";
    }
    static to0360(angle) {
        return (angle + 360 * Math.ceil(1 + Math.abs(angle / 360))) % 360;
    }
    static turnABit(currentAngle, desiredAngle, delta) {
        currentAngle = Helper.to0360(currentAngle);
        let origDesiredAngle = desiredAngle;
        let angle = currentAngle;
        angle = Helper.to0360(angle);
        desiredAngle = Helper.to0360(desiredAngle + 360);
        let resultAngle = Helper.to0360(desiredAngle + 360 - angle);
        angle = 0;
        let direction = 1;
        if (resultAngle <= 180)
            direction = 1;
        else
            direction = -1;
        if (resultAngle < delta || Math.abs(360 - delta) < resultAngle)
            return origDesiredAngle;
        return Helper.to0360(currentAngle + delta * direction);
    }
}
//# sourceMappingURL=Helper.js.map