import React, { Component } from 'react';
import $ from 'jquery';
import 'bootstrap/js/dist/tooltip';

const GRID_MARGIN = 5;
const LABEL_MARGIN = 20;
const VERTEX_REGION_SIZE = 10;

class Windrose extends Component {

    constructor(props) {
        super(props);
        const { size, grid, values } = this.props;
        this.r = size / 2 - GRID_MARGIN;
        this.rUnit = this.r / grid.scale.maxValue;
        this.rStep = this.rUnit * grid.scale.step;
        this.rStepCount = Math.trunc(grid.scale.maxValue / grid.scale.step);
        this.rValues = values.map(value => this.rUnit * value);
        this.aStep = Math.PI / grid.axes.length;
        this.vertexes = this.rValues.map((rValue, i) => ({
            x: this.r + Math.cos(this.getAxisAngle(i)) * rValue, 
            y: this.r - Math.sin(this.getAxisAngle(i)) * rValue,
        }));
        this.ctx = null;
        this.canvasRef = React.createRef();
        this.containerRef = React.createRef();
    }

    getAxisAngle(index) {
        return this.aStep * index;
    }

    draw() {
        const { grid, polygon } = this.props;
        const { r, rStep, rStepCount, vertexes, ctx } = this;
        let i;

        // draw grid

        ctx.strokeStyle = grid.color;

        // levels
        for (i = 1; i <= rStepCount; i++) {
            ctx.beginPath();
            ctx.arc(r, r, rStep * i, 0, Math.PI * 2);
            ctx.stroke(); 
        }

        // outline
        ctx.beginPath();
        ctx.arc(r, r, r, 0, Math.PI * 2);
        ctx.stroke(); 

        // axes
        let axisAngle;
        for (i = 0; i < grid.axes.length; i++) {
            axisAngle = this.getAxisAngle(i);
            ctx.beginPath();
            ctx.moveTo(r + Math.cos(axisAngle) * r, r - Math.sin(axisAngle) * r);
            ctx.lineTo(r + Math.cos(Math.PI + axisAngle) * r, r - Math.sin(Math.PI + axisAngle) * r);
            ctx.stroke(); 
        }

        // draw polygon

        ctx.strokeStyle = polygon.lineColor;
        ctx.lineWidth = polygon.lineWidth;
        ctx.fillStyle = polygon.fillColor;
        ctx.beginPath();
        ctx.moveTo(vertexes[0].x, vertexes[0].y);
        for (i = 1; i < vertexes.length; i++) {
            ctx.lineTo(vertexes[i].x, vertexes[i].y);
        }
        ctx.closePath();
        ctx.fill(); 
        ctx.stroke(); 

        // vertexes
        
        ctx.fillStyle = polygon.lineColor;
        for (i = 0; i < vertexes.length; i++) {
            ctx.beginPath();
            ctx.arc(vertexes[i].x, vertexes[i].y, polygon.vertexRadius, 0, Math.PI * 2);
            ctx.fill(); 
        }
    }

    componentDidMount() {
        this.ctx = this.canvasRef.current.getContext('2d');
        this.draw();
        $('[data-toggle="tooltip"]', this.containerRef.current).tooltip();
    }

    render() {
        const { size, grid, values } = this.props;

        if (!values.length) {
            return null;
        }

        const { r, vertexes } = this;
        const labelR = size / 2 + LABEL_MARGIN;

        return <div ref={this.containerRef} style={{ width: size, height: size }} className="Windrose position-relative">
            <canvas ref={this.canvasRef} width={size} height={size} />
            {grid.axes.map((axis, i) => {
                const axisAngle = this.getAxisAngle(i);
                const styleFirst = {
                    left: r + Math.cos(axisAngle) * labelR,
                    top: r - Math.sin(axisAngle) * labelR,
                    transform: 'translate(-50%, -50%)'
                };
                const styleSecond = {
                    left: r + Math.cos(Math.PI + axisAngle) * labelR,
                    top: r - Math.sin(Math.PI + axisAngle) * labelR,
                    transform: 'translate(-50%, -50%)'
                };
                return <React.Fragment key={i}>
                    <span style={styleFirst} className="position-absolute">{axis[0]}</span>
                    <span style={styleSecond} className="position-absolute">{axis[1]}</span>
                </React.Fragment>
            })}
            {vertexes.map((vertex, i) => {
                const style = {
                    position: 'absolute',
                    left: vertex.x,
                    top: vertex.y,
                    width: VERTEX_REGION_SIZE, 
                    height: VERTEX_REGION_SIZE, 
                    transform: 'translate(-50%, -50%)',
                };
                return <div key={i} data-toggle="tooltip" title={values[i]} style={style}></div>;
            })}
        </div> ;
    }

    componentDidUpdate(prevProps) {
        this.draw();
    }
}

export default Windrose;