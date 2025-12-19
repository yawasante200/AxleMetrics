import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface EALFVisualizationProps {
    axleLoad: number; // Current input load
    standardLoad: number; // Standard load (e.g. 18 kip or 80 kN) or 0 if not applicable
    result: number | null; // Calculated EALF
    unit: string;
}

export function EALFVisualization({ axleLoad, standardLoad, result, unit }: EALFVisualizationProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !result) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous

        const width = 400;
        const height = 300;
        const margin = { top: 40, right: 30, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Data for bar chart
        const data = [
            { label: 'Std Load', value: standardLoad, color: '#94a3b8' }, // gray-400
            { label: 'Axle Load (Lx)', value: axleLoad, color: '#3b82f6' }, // blue-500
        ];

        // Scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([0, innerWidth])
            .padding(0.4);

        const yScale = d3.scaleLinear()
            .domain([0, Math.max(standardLoad, axleLoad) * 1.2]) // Add 20% headroom
            .range([innerHeight, 0]);

        // Draw Axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('font-size', '12px')
            .attr('color', '#4b5563');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .attr('font-size', '12px')
            .attr('color', '#4b5563');

        // Draw Grid Lines
        g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-innerWidth)
                .tickFormat(() => '')
            )
            .attr('stroke', '#e5e7eb')
            .attr('stroke-dasharray', '3,3')
            .select('.domain').remove();

        // Draw Bars
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.label)!)
            .attr('y', innerHeight) // Start at bottom
            .attr('width', xScale.bandwidth())
            .attr('height', 0) // Start height 0
            .attr('fill', d => d.color)
            .attr('rx', 6) // Rounded corners top
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut)
            .attr('y', d => yScale(d.value))
            .attr('height', d => innerHeight - yScale(d.value));

        // Axis Labels
        g.append('text')
            .attr('x', -innerHeight / 2)
            .attr('y', -45)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr('fill', '#6b7280')
            .text(`Load (${unit})`);

    }, [axleLoad, standardLoad, result, unit]);

    if (!result) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-gray-400 text-sm">
                Enter values to visualize comparison
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <h3 className="text-gray-900 font-semibold mb-2">Load Comparison & Impact</h3>
            <svg
                ref={svgRef}
                viewBox="0 0 400 300"
                className="w-full h-auto max-w-[400px] bg-white rounded-xl"
            />
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Impact Factor (EALF)</p>
                <motion.div
                    key={result}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                    {result.toFixed(4)}
                </motion.div>
                <p className="text-xs text-gray-400 mt-2">
                    1 Axle pass ≈ {result.toFixed(2)} Standard Axle passes
                </p>
            </div>
        </div>
    );
}
