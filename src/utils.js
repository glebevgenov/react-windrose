export const getMAngleDegrees = (tAngleRadians) => {
    const mAngleRadians = Math.PI * 2 - (tAngleRadians + Math.PI / 2) % (Math.PI * 2);
    if (mAngleRadians === Math.PI * 2) {
        return 0;
    }
    return mAngleRadians * (180 / Math.PI);
}

export const isMAngleInRange = (mAngle, min, max) => {
    if (min > max) {
        max = max + 360;
    }
    return mAngle >= min && mAngle < max;
}

export const computeWindroseValues = ([...measurements], axisCount, interpolate = false) => {
    const aStep = Math.PI / axisCount;
    const mDirs = Array.from({ length: axisCount * 2 }, (v, k) => {
        const axisAngle = k * aStep;
        return { 
            min: getMAngleDegrees(axisAngle + aStep / 2),
            max: getMAngleDegrees(axisAngle - aStep / 2),
            axisIndex: k,
            value: 0,
        }
    }).sort((a, b) => a.min - b.min);

    measurements.sort((a, b) => {
        return a.deg - b.deg;
    });

    mDirs.forEach((mDir) => {
        let values = [];
        let measurement;
        while (measurements.length 
            && isMAngleInRange(measurements[0].deg, mDir.min, mDir.max)
        ) {
            measurement = measurements.shift();
            values.push(measurement.speed);
        }
        if (values.length) {
            mDir.value = Math.round(values.reduce((prev, curr) => prev + curr) / values.length * 100) / 100;
        }
    });

    let values = mDirs.sort((a, b) => a.axisIndex - b.axisIndex).map((mDir) => {
        return Math.round(mDir.value * 100) / 100;
    });

    if (interpolate) {
        values = values.map((value, i) => {
            if (!value) {
                const iPrev = (mDirs.length + i - 1) % mDirs.length;
                const iNext = (mDirs.length + i + 1) % mDirs.length;
                if (mDirs[iPrev].value && mDirs[iNext].value) {
                    return Math.round((mDirs[iPrev].value + mDirs[iNext].value) / 2 * 100) / 100;
                }
            } 
            return value;
        });
    }

    return values;
}