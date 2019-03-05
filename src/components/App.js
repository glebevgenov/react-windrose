import React, { Component } from 'react'; 
import measurements from '../measurements';
import Windrose from './Windrose';
import { computeWindroseValues } from '../utils';

class App extends Component {
    
    render() {
        return (
            <div className="App container d-flex flex-column my-5">
                <h2>Роза ветров</h2>
                <div className="row">
                    <div className="col-lg-6 d-flex flex-column align-items-center">
                        <div className="p-5">
                            <Windrose 
                                size={200}
                                grid={{
                                    axes: [['В','З'], ['C','Ю']],
                                    scale: { maxValue: 6, step: 2 },
                                    color: 'rgb(105, 105, 105)',
                                }}
                                polygon={{
                                    vertexRadius: 2,
                                    lineWidth: 2,
                                    lineColor: 'rgb(240, 128, 128)',
                                    fillColor: 'rgba(240, 128, 128, 0.5)',
                                }}
                                values={computeWindroseValues(measurements, 2)} 
                            />
                        </div>
                        <div className="p-5">
                            <Windrose 
                                size={300}
                                grid={{
                                    axes: [['В','З'], ['СВ', 'ЮЗ'], ['C','Ю'], ['СЗ', 'ЮВ']],
                                    scale: { maxValue: 6, step: 2 },
                                    color: 'rgb(105, 105, 105)',
                                }}
                                polygon={{
                                    vertexRadius: 3,
                                    lineWidth: 2,
                                    lineColor: 'rgb(240, 128, 128)',
                                    fillColor: 'rgba(240, 128, 128, 0.5)',
                                }}
                                values={computeWindroseValues(measurements, 4)} 
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 d-flex flex-column align-items-center">
                        <div className="p-5">
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
                                values={computeWindroseValues(measurements, 8, true)} 
                            />
                        </div>
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