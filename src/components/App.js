import React, { Component } from 'react'; 
import measurements from '../measurements';
import Windrose from './Windrose';

class App extends Component {

    getMAngleDegrees(tAngleRadians) {
        const mAngleRadians = Math.PI * 2 - (tAngleRadians + Math.PI / 2) % (Math.PI * 2);
        if (mAngleRadians === Math.PI * 2) {
            return 0;
        }
        return mAngleRadians * (180 / Math.PI);
    }

    isMAngleInRange(mAngle, min, max) {
        if (min > max) {
            max = max + 360;
        }
        return mAngle >= min && mAngle < max;
    }

    computeWindroseValues([...measurements], axisCount, interpolate = false) {
        const aStep = Math.PI / axisCount;
        const mDirs = Array.from({ length: axisCount * 2 }, (v, k) => {
            const axisAngle = k * aStep;
            return { 
                min: this.getMAngleDegrees(axisAngle + aStep / 2),
                max: this.getMAngleDegrees(axisAngle - aStep / 2),
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
                && this.isMAngleInRange(measurements[0].deg, mDir.min, mDir.max)
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

    render() {
        return (
            <div className="App container d-flex flex-column">
                <div className="row">
                    <div className="col-md-6 d-flex flex-column align-items-center">
                        <div className="py-5">
                            <Windrose 
                                size={200}
                                grid={{
                                    axes: [['В','З'], ['C','Ю']],
                                    scale: { maxValue: 6, step: 2 },
                                    color: 'rgb(105, 105, 105)',
                                }}
                                polygon={{
                                    vertexRadius: 4,
                                    lineWidth: 2,
                                    lineColor: 'rgb(240, 128, 128)',
                                    fillColor: 'rgba(240, 128, 128, 0.5)',
                                }}
                                values={this.computeWindroseValues(measurements, 2)} 
                            />
                        </div>
                        <div className="py-5">
                            <Windrose 
                                size={300}
                                grid={{
                                    axes: [['В','З'], ['СВ', 'ЮЗ'], ['C','Ю'], ['СЗ', 'ЮВ']],
                                    scale: { maxValue: 6, step: 2 },
                                    color: 'rgb(105, 105, 105)',
                                }}
                                polygon={{
                                    vertexRadius: 4,
                                    lineWidth: 2,
                                    lineColor: 'rgb(240, 128, 128)',
                                    fillColor: 'rgba(240, 128, 128, 0.5)',
                                }}
                                values={this.computeWindroseValues(measurements, 4)} 
                            />
                        </div>
                    </div>
                    <div className="col-md-6 d-flex flex-row justify-content-center align-items-center py-5">
                        <Windrose 
                            size={500}
                            grid={{
                                axes: [['В','З'], ['СВВ', 'ЮЗЗ'], ['СВ', 'ЮЗ'], ['СCВ', 'ЮЮЗ'], ['C','Ю'], ['СCЗ', 'ЮЮВ'], ['СЗ', 'ЮВ'], ['СЗЗ', 'ЮВВ']],
                                scale: { maxValue: 6, step: 1 },
                                color: 'rgb(105, 105, 105)',
                            }}
                            polygon={{
                                vertexRadius: 4,
                                lineWidth: 2,
                                lineColor: 'rgb(240, 128, 128)',
                                fillColor: 'rgba(240, 128, 128, 0.5)',
                            }}
                            values={this.computeWindroseValues(measurements, 8, true)} 
                        />
                    </div>
                </div>
                <h4>Измерения</h4>
                <div className="row small">
                    {measurements.map((measurement, index) => {
                        return <div key={index} className="col-md-2 col-sm-3">{measurement.deg}&deg; - {measurement.speed} м/с</div>
                    })}
                </div>
            </div>
        );
    }
}

export default App;