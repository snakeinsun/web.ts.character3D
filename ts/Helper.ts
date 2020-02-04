class Helper {
    static numToString(value: number) {
        return "(" + (value < 0 ? "-" : "") + String(Math.round(Math.abs(value) * 1000) / 1000) + ")";
    }

    static to0360(angle: number) {
        return (angle + 360 * Math.ceil(1 + Math.abs(angle / 360))) % 360;
    }

    static turnABit(currentAngle: number, desiredAngle: number, delta: number) {
        currentAngle = Helper.to0360(currentAngle);
        let origDesiredAngle = desiredAngle;

        let angle = currentAngle;

        // normalize
        angle = Helper.to0360(angle);
        desiredAngle = Helper.to0360(desiredAngle + 360);

        // rotate
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