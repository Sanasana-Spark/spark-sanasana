import React from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = ({options}) => {
  return (
    <div className="chart">
        <div className="bar">
            <div className="cbdata" style={{height: `${options.one}%`, backgroundColor: '#0047FF80'}}></div>
        </div>
        <div className="bar">
            <div className="cbdata" style={{height: `${options.two}%`, backgroundColor: '#0047FF80'}}></div>
        </div>
        <div className="bar">
            <div className="cbdata" style={{height: `${options.three}%`, backgroundColor: '#0047FF80'}}></div>
        </div>
        <div className="bar">
            <div className="cbdata" style={{height: `${options.four}%`, backgroundColor: '#0047FF80'}}></div>
        </div>
    </div>
  )
}

export default Chart