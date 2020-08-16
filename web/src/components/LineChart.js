import React from "react";
import { Line } from '@nivo/line'

// https://colorhunt.co/palette/179373
function LineChart({ data, width, height }) {
  const accent = "#f2a365";
  const light = "#ececec";
  return (
    <Line
      width={width}
      height={height}
      margin={{
        top: 60,
        right: 60,
        bottom: 60,
        left: 60,
      }}
      data={data}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      pointColor={light}
      pointSize={10}
      xFormat="time:%Y-%m-%d"
      yScale={{
        type: 'linear',
        stacked: true,
        min: 'auto',
      }}
      axisBottom={{
        format: '%b %d',
        tickValues: 'every 1 days',
      }}
      enableGridX={false}
      colors={[accent]}
      theme={{
        axis: {
          ticks: {
            line: {
              stroke: light
            },
            text: {
              fill: light
            }
          }
        },
        grid: {
          line: {
            stroke: light,
            strokeWidth: 2,
            strokeDasharray: "4 4"
          }
        },
      }}
    />
  );
}

export default LineChart;