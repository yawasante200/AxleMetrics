import React from 'react';
import { YearlyESALData } from '../design-esal/types';

interface YearlyESALChartProps {
  data: YearlyESALData[];
  title?: string;
  className?: string;
}

/**
 * Chart component showing Yearly Design ESAL vs Year
 * Uses SVG for PDF compatibility
 */
const YearlyESALChart: React.FC<YearlyESALChartProps> = ({
  data,
  title = 'Yearly Design ESAL vs Year',
  className = ''
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 280;
  const padding = { top: 40, right: 40, bottom: 60, left: 80 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Calculate scales
  const years = data.map(d => d.year);
  const esalValues = data.map(d => d.yearlyESAL);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const maxEsal = Math.max(...esalValues);
  
  // Add some padding to max value for better visualization
  const yMax = maxEsal * 1.1;

  // Scale functions
  const xScale = (year: number) => 
    padding.left + ((year - minYear) / (maxYear - minYear || 1)) * plotWidth;
  const yScale = (esal: number) => 
    padding.top + plotHeight - (esal / yMax) * plotHeight;

  // Generate Y-axis ticks
  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => (yMax / yTickCount) * i);

  // Generate X-axis ticks (show every year or every 2-5 years depending on range)
  const yearRange = maxYear - minYear;
  const xTickInterval = yearRange <= 10 ? 1 : yearRange <= 20 ? 2 : 5;
  const xTicks = years.filter((_, i) => i % xTickInterval === 0 || i === years.length - 1);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toFixed(0);
  };

  // Generate path for line chart
  const linePath = data.map((d, i) => {
    const x = xScale(d.year);
    const y = yScale(d.yearlyESAL);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate points for area fill
  const areaPath = `
    M ${xScale(data[0].year)} ${padding.top + plotHeight}
    ${data.map(d => `L ${xScale(d.year)} ${yScale(d.yearlyESAL)}`).join(' ')}
    L ${xScale(data[data.length - 1].year)} ${padding.top + plotHeight}
    Z
  `;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 text-center">
        {title}
      </h4>
      <svg 
        width="100%" 
        height={chartHeight} 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="mx-auto"
        style={{ maxWidth: `${chartWidth}px` }}
      >
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={`grid-${i}`}
            x1={padding.left}
            y1={yScale(tick)}
            x2={padding.left + plotWidth}
            y2={yScale(tick)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#esalGradient)"
          opacity="0.3"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="esalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Line chart */}
        <path
          d={linePath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={`point-${i}`}
            cx={xScale(d.year)}
            cy={yScale(d.yearlyESAL)}
            r="4"
            fill="#ffffff"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        ))}

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + plotHeight}
          x2={padding.left + plotWidth}
          y2={padding.top + plotHeight}
          stroke="#374151"
          strokeWidth="1"
        />

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + plotHeight}
          stroke="#374151"
          strokeWidth="1"
        />

        {/* X-axis labels */}
        {xTicks.map((year, i) => (
          <text
            key={`xlabel-${i}`}
            x={xScale(year)}
            y={padding.top + plotHeight + 20}
            textAnchor="middle"
            fontSize="11"
            fill="#6b7280"
          >
            {year}
          </text>
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={`ylabel-${i}`}
            x={padding.left - 10}
            y={yScale(tick) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {formatNumber(tick)}
          </text>
        ))}

        {/* Axis titles */}
        <text
          x={padding.left + plotWidth / 2}
          y={chartHeight - 10}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#374151"
        >
          Year
        </text>
        <text
          x={15}
          y={padding.top + plotHeight / 2}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="#374151"
          transform={`rotate(-90, 15, ${padding.top + plotHeight / 2})`}
        >
          Yearly Design ESAL
        </text>
      </svg>
    </div>
  );
};

export default YearlyESALChart;
