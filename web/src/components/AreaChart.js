import React from 'react';
import { Group } from '@visx/group';
import { AreaClosed } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { LinearGradient } from '@visx/gradient';
import { curveMonotoneX } from '@visx/curve';

const axisColor = '#696969';
const axisBottomTickLabelProps = {
    textAnchor: 'middle',
    fontFamily: 'Arial',
    fontSize: 10,
    fill: axisColor,
};
const axisLeftTickLabelProps = {
    dx: '-0.25em',
    dy: '0.25em',
    fontFamily: 'Arial',
    fontSize: 10,
    textAnchor: 'end',
    fill: axisColor,
};

const getDate = d => new Date(d.timestamp + " UTC");
const getStockValue = d => d.data;

export default function AreaChart({
    data,
    gradientColor,
    width,
    yMax,
    margin,
    xScale,
    yScale,
    hideBottomAxis = false,
    hideLeftAxis = false,
    top,
    left,
    children,
}) {
    if (width < 10) return null;
    return (
        <Group left={left || margin.left} top={top || margin.top}>
            <LinearGradient
                id="gradient"
                from={gradientColor}
                fromOpacity={1}
                to={gradientColor}
                toOpacity={1}
            />
            <AreaClosed
                data={data}
                x={d => xScale(getDate(d)) || 0}
                y={d => yScale(getStockValue(d)) || 0}
                yScale={yScale}
                strokeWidth={1}
                stroke="url(#gradient)"
                fill="url(#gradient)"
                curve={curveMonotoneX}
            />
            {!hideBottomAxis && (
                <AxisBottom
                    top={yMax}
                    scale={xScale}
                    numTicks={width > 520 ? 10 : 5}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => axisBottomTickLabelProps}
                />
            )}
            {!hideLeftAxis && (
                <AxisLeft
                    scale={yScale}
                    numTicks={5}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={() => axisLeftTickLabelProps}
                />
            )}
            {children}
        </Group>
    );
}
