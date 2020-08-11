import React from 'react';
import { Line } from '@nivo/line'

const commonProperties = {
  width: 1500,
  height: 1000,
  margin: { top: 20, right: 20, bottom: 60, left: 80 },
  animate: true,
  enableSlices: 'x',
}

function App() {
  return (
    <Line
      {...commonProperties}
      data={[
        {
          id: 'Moisture',
          data: [
            { x: '2018-01-01', y: 734 },
            { x: '2018-01-02', y: 710 },
            { x: '2018-01-03', y: 682 },
            { x: '2018-01-04', y: 620 },
            { x: '2018-01-05', y: 590 },
            { x: '2018-01-06', y: 734 },
            { x: '2018-01-07', y: 705 },
            { x: '2018-01-08', y: 690 },
          ],
        },
      ]}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: true,
        min: 'auto'
      }}
      axisBottom={{
        format: '%b %d',
        tickValues: 'every 2 days',
      }}
      pointSize={16}
      pointBorderColor={{
        from: 'color',
        modifiers: [['darker', 0.3]],
      }}
    />
  );
}

export default App;
