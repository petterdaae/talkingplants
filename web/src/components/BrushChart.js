import React, { useState, useMemo } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { Brush } from '@visx/brush';
import { PatternLines } from '@visx/pattern';
import { LinearGradient } from '@visx/gradient';
import { max, extent, min } from 'd3-array';

import AreaChart from './AreaChart';

const brushMargin = { top: 10, bottom: 15, left: 50, right: 20 };
const chartSeparation = 30;
const PATTERN_ID = 'brush_pattern';
const GRADIENT_ID = 'brush_gradient';
export const accentColor = '#696969';
export const background = '#F5F5DC';
export const background2 = '#99ccff' //'#af8baf';
const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: '#696969',
};

const getDate = (d) => new Date(d.timestamp);
const getDataValue = (d) => d.data;

function BrushChart({
    compact = false,
    width,
    height,
    margin = {
        top: 20,
        left: 50,
        bottom: 20,
        right: 20,
    },
    data,
    minPadding
}) {
    const [filteredData, setFilteredData] = useState(data);

    const onBrushChange = (domain) => {
        if (!domain) return;
        const { x0, x1, y0, y1 } = domain;
        const dataCopy = data.filter(s => {
            const x = getDate(s).getTime();
            const y = getDataValue(s);
            return x > x0 && x < x1 && y > y0 && y < y1;
        });
        setFilteredData(dataCopy);
    };

    const innerHeight = height - margin.top - margin.bottom;
    const topChartBottomMargin = compact ? chartSeparation / 2 : chartSeparation + 10;
    const topChartHeight = 0.8 * innerHeight - topChartBottomMargin;
    const bottomChartHeight = innerHeight - topChartHeight - chartSeparation;

    const xMax = Math.max(width - margin.left - margin.right, 0);
    const yMax = Math.max(topChartHeight, 0);
    const xBrushMax = Math.max(width - brushMargin.left - brushMargin.right, 0);
    const yBrushMax = Math.max(bottomChartHeight - brushMargin.top - brushMargin.bottom, 0);

    const dateScale = useMemo(
        () =>
            scaleTime({
                range: [0, xMax],
                domain: extent(filteredData, getDate),
            }),
        [xMax, filteredData],
    );
    const dataScale = useMemo(
        () => {
            let domainStart = min(filteredData, getDataValue) - minPadding;
            domainStart = domainStart < 0 ? 0 : domainStart;
            return scaleLinear({
                range: [yMax, 0],
                domain: [domainStart, max(filteredData, getDataValue) || 0],
                nice: true,
            })
        },
        [yMax, filteredData, minPadding],
    );
    const brushDateScale = useMemo(
        () =>
            scaleTime({
                range: [0, xBrushMax],
                domain: extent(data, getDate),
            }),
        [xBrushMax, data],
    );
    const brushDataScale = useMemo(
        () =>
            scaleLinear({
                range: [yBrushMax, 0],
                domain: [0, max(data, getDataValue) || 0],
                nice: true,
            }),
        [yBrushMax, data],
    );

    const initialBrushPosition = useMemo(
        () => ({
            start: { x: brushDateScale(getDate(data[0])) },
            end: { x: brushDateScale(getDate(data[data.length - 1])) },
        }),
        [brushDateScale, data],
    );

    return (
        <div>
            <svg width={width} height={height}>
                <LinearGradient id={GRADIENT_ID} from={background} to={background} />
                <rect x={0} y={0} width={width} height={height} fill={`url(#${GRADIENT_ID})`} rx={14} />
                <AreaChart
                    hideBottomAxis={compact}
                    data={filteredData}
                    width={width}
                    margin={{ ...margin, bottom: topChartBottomMargin }}
                    yMax={yMax}
                    xScale={dateScale}
                    yScale={dataScale}
                    gradientColor={background2}
                />
                <AreaChart
                    hideBottomAxis
                    hideLeftAxis
                    data={data}
                    width={width}
                    yMax={yBrushMax}
                    xScale={brushDateScale}
                    yScale={brushDataScale}
                    margin={brushMargin}
                    top={topChartHeight + topChartBottomMargin + margin.top}
                    gradientColor={background2}
                >
                    <PatternLines
                        id={PATTERN_ID}
                        height={8}
                        width={8}
                        stroke={accentColor}
                        strokeWidth={1}
                        orientation={['diagonal']}
                    />
                    <Brush
                        xScale={brushDateScale}
                        yScale={brushDataScale}
                        width={xBrushMax}
                        height={yBrushMax}
                        margin={brushMargin}
                        handleSize={8}
                        resizeTriggerAreas={['left', 'right']}
                        brushDirection="horizontal"
                        initialBrushPosition={initialBrushPosition}
                        onChange={onBrushChange}
                        onClick={() => setFilteredData(data)}
                        selectedBoxStyle={selectedBrushStyle}
                    />
                </AreaChart>
            </svg>
        </div>
    );
}

export default BrushChart;