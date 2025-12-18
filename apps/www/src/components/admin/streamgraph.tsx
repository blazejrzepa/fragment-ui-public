"use client";

import * as React from "react";
import * as d3 from "d3";
import { Slider } from "@fragment_ui/ui";

export interface StreamgraphDataPoint {
  date: Date;
  [key: string]: Date | number;
}

export interface StreamgraphProps {
  data: StreamgraphDataPoint[];
  keys: string[];
  height?: number;
  width?: number;
  colors?: string[];
  className?: string;
  showOffsetControl?: boolean;
}

export function Streamgraph({
  data,
  keys,
  height = 300,
  width,
  colors,
  className,
  showOffsetControl = true,
}: StreamgraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(width || 0);
  const [offsetValue, setOffsetValue] = React.useState([1]); // 0=wiggle, 1=silhouette, 2=expand, 3=diverging
  const [hoveredLayer, setHoveredLayer] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!containerRef.current || !data.length || !keys.length) return;

    // Get container width - always use 100% of container
    const updateWidth = () => {
      const w = width || containerRef.current?.clientWidth || 800;
      setContainerWidth(w);
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen to window resize
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [width]);

  React.useEffect(() => {
    if (!svgRef.current || !containerWidth || !data.length || !keys.length) return;

    const svg = d3.select(svgRef.current);
    const existingPaths = svg.selectAll(".layer path");
    const hasExistingPaths = !existingPaths.empty();

    if (!hasExistingPaths) {
      svg.selectAll("*").remove();
    }

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    // Define offset functions
    const offsetFunctions = [
      d3.stackOffsetWiggle,      // 0 - classic streamgraph
      d3.stackOffsetSilhouette,   // 1 - centered around zero
      d3.stackOffsetExpand,       // 2 - normalized to [0,1]
      d3.stackOffsetDiverging,    // 3 - diverging from zero
    ];

    const selectedOffset = offsetFunctions[offsetValue[0] || 1];

    // Stack data with selected offset
    const stack = d3
      .stack<StreamgraphDataPoint>()
      .keys(keys)
      .offset(selectedOffset)
      .order(d3.stackOrderInsideOut);

    const stackedData = stack(data);

    // Get y domain
    const yMax = d3.max(stackedData, (d) => d3.max(d, (d) => d[1])) || 0;
    const yMin = d3.min(stackedData, (d) => d3.min(d, (d) => d[0])) || 0;
    const yPadding = Math.abs(yMax - yMin) * 0.1;

    const y = d3
      .scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([innerHeight, 0]);

    // Color scale - use brand colors or default scheme
    // Get CSS variable values or use fallback hex colors
    const getCSSColor = (varName: string, fallback: string) => {
      if (typeof window === "undefined") return fallback;
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      return value || fallback;
    };

    const defaultColors = colors || [
      getCSSColor("--color-brand-primary", "#6366F1"),
      getCSSColor("--color-accent-green", "#22C55E"),
      getCSSColor("--color-accent-red", "#EF4444"),
      "#8B5CF6",
      "#F59E0B",
      "#EC4899",
    ];
    const colorScale = d3.scaleOrdinal(defaultColors);

    // Area generator with basis curve for smooth streamgraph
    const area = d3
      .area<d3.SeriesPoint<StreamgraphDataPoint>>()
      .x((d) => x(d.data.date))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    // Create group for chart
    let g = svg.select<SVGGElement>("g.chart-group");
    if (g.empty()) {
      g = svg
        .append<SVGGElement>("g")
        .attr("class", "chart-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    } else {
      g.attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // Bind data to layers
    const layers = g
      .selectAll<SVGGElement, d3.Series<StreamgraphDataPoint, string>>(".layer")
      .data(stackedData, (d) => d.key);

    // Enter: create new layers
    const layersEnter = layers
      .enter()
      .append("g")
      .attr("class", "layer")
      .style("cursor", "pointer");

    // Create paths for new layers
    layersEnter
      .append("path")
      .attr("d", (d) => area(d as any))
      .style("fill", (d, i) => {
        const layerIndex = stackedData.indexOf(d);
        return colorScale(layerIndex.toString());
      })
      .style("opacity", hasExistingPaths ? 0 : 0.8)
      .style("stroke", "none")
      .style("stroke-width", 0.5)
      .style("stroke-opacity", 0);

    // Merge layers
    const layersMerged = layers.merge(layersEnter);

    // Update paths with animation
    layersMerged
      .selectAll<SVGPathElement, d3.Series<StreamgraphDataPoint, string>>("path")
      .data((d) => [d])
      .transition()
      .duration(hasExistingPaths ? 1500 : 0)
      .ease(d3.easeCubicInOut)
      .attr("d", (d) => area(d as any))
      .style("fill", function (d) {
        const parent = d3.select(this.parentNode as SVGGElement);
        const layerIndex = stackedData.findIndex((layer) => layer === d);
        return colorScale(layerIndex.toString());
      })
      .style("opacity", function (d) {
        const parent = d3.select(this.parentNode as SVGGElement);
        const layerIndex = stackedData.findIndex((layer) => layer === d);
        if (hoveredLayer !== null) {
          return hoveredLayer === layerIndex ? 1 : 0.3;
        }
        return 0.8;
      })
      .style("stroke-opacity", function (d) {
        const parent = d3.select(this.parentNode as SVGGElement);
        const layerIndex = stackedData.findIndex((layer) => layer === d);
        if (hoveredLayer !== null) {
          return hoveredLayer === layerIndex ? 0.5 : 0;
        }
        return 0;
      });

    // Add hover interactions
    layersMerged
      .on("mouseenter", function (event, d) {
        const index = stackedData.indexOf(d);
        setHoveredLayer(index);
        d3.select(this)
          .select("path")
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke-opacity", 0.5);
        
        // Dim other layers
        layersMerged
          .filter((otherD) => otherD !== d)
          .select("path")
          .transition()
          .duration(200)
          .style("opacity", 0.3);
      })
      .on("mouseleave", function () {
        setHoveredLayer(null);
        layersMerged
          .select("path")
          .transition()
          .duration(200)
          .style("opacity", 0.8)
          .style("stroke-opacity", 0);
      });

    // Exit: remove old layers
    layers
      .exit()
      .transition()
      .duration(1500)
      .style("opacity", 0)
      .remove();

    // Cleanup only on unmount
    return () => {
      // Don't remove on every update, only on unmount
    };
  }, [data, keys, height, containerWidth, colors, offsetValue, hoveredLayer]);

  const offsetLabels = [
    "Wiggle",
    "Silhouette",
    "Expand",
    "Diverging",
  ];

  return (
    <div ref={containerRef} className="w-full">
      {showOffsetControl && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-fg-muted)]">Offset:</span>
            <span className="font-medium text-[color:var(--color-fg-base)]">
              {offsetLabels[offsetValue[0] || 1]}
            </span>
          </div>
          <Slider
            value={offsetValue}
            onValueChange={setOffsetValue}
            min={0}
            max={3}
            step={1}
            className="w-full"
          />
        </div>
      )}
      <div className="w-full" style={{ overflow: "hidden" }}>
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${containerWidth || 800} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className={className}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}

