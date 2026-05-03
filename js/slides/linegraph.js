import { rawData, allRawData } from '../data/movieData.js';

let graphInitialized = false;

export function initLineGraph() {
    if (graphInitialized) return;
    graphInitialized = true;
    
    // Filter data from 1950 to 2016
    const filteredData = Object.entries(rawData)
        .filter(([year]) => {
            const y = parseInt(year);
            return y >= 1950 && y <= 2016;
        })
        .map(([year, value]) => ({ 
            year: parseInt(year), 
            value: value,
            total: allRawData[year] || 0  // Get total Oscar movies for that year
        }))
        .sort((a, b) => a.year - b.year);
    
    const width = 800;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select("#lineGraph");
    svg.html("");
    
    svg.attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("height", "auto")
        .style("background", "transparent");
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Create a tooltip div (hidden by default)
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "graph-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0,0,0,0.9)")
        .style("color", "#ffbc6e")
        .style("padding", "10px 16px")
        .style("border-radius", "10px")
        .style("font-size", "12px")
        .style("font-family", "'Inter', monospace")
        .style("font-weight", "500")
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("backdrop-filter", "blur(8px)")
        .style("border", "1px solid rgba(255,188,110,0.4)")
        .style("box-shadow", "0 4px 15px rgba(0,0,0,0.4)")
        .style("white-space", "nowrap")
        .style("line-height", "1.4");
    
    const xScale = d3.scaleLinear()
        .domain([1950, 2017])
        .range([0, innerWidth]);
    
    const values = filteredData.map(d => d.value);
    const minValue = Math.floor(Math.min(...values)) - 1;
    const maxValue = Math.ceil(Math.max(...values)) + 2;
    
    const yScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([innerHeight, 0]);
    
    function calculateTrendline(data) {
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        data.forEach(d => {
            sumX += d.year;
            sumY += d.value;
            sumXY += d.year * d.value;
            sumX2 += d.year * d.year;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        const firstYear = data[0].year;
        const lastYear = data[data.length - 1].year;
        
        return [
            { year: firstYear, value: slope * firstYear + intercept },
            { year: lastYear, value: slope * lastYear + intercept }
        ];
    }
    
    const trendlineData = calculateTrendline(filteredData);
    
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
    
    // Draw main line
    const lineAnimationDuration = 3000;
    const mainPath = g.append("path")
        .attr("class", "main-line")
        .attr("fill", "none")
        .attr("stroke", "#ffb347")
        .attr("stroke-width", 2.5)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("d", lineGenerator(filteredData));
    
    const totalLength = mainPath.node().getTotalLength();
    mainPath.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(lineAnimationDuration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    
    // Add ALL nodes and labels at once (no staggered delays)
    setTimeout(() => {
        // Add all circles at once with hover tooltips
        g.selectAll(".data-node")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "data-node")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.value))
            .attr("r", 0)
            .attr("fill", "#ffb347")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("cursor", "pointer")
            .on("mouseover", function(event, d) {
                // Create tooltip text with full sentence
                // const tooltipText = `Year ${d.year}:<br>Out of the ${d.total} movies nominated for Oscars,<br>${d.value} are Oscar Bait`;
                const tooltipText = `${d.value} Oscar Baits`;
                
                tooltip.style("visibility", "visible")
                    .html(tooltipText)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 35) + "px");
                
                // Highlight the hovered node
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 7)
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2.5);
            })
            .on("mousemove", function(event, d) {
                // Update tooltip position to follow cursor
                tooltip.style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 35) + "px");
            })
            .on("mouseout", function() {
                // Hide tooltip
                tooltip.style("visibility", "hidden");
                
                // Restore node size
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 4.5)
                    .attr("stroke-width", 1);
            })
            .transition()
            .duration(300)
            .attr("r", 4.5);
        
        // Add all labels at once (commented out as requested)
        filteredData.forEach(d => {
            let labelX = xScale(d.year) + 7;
            let labelY = yScale(d.value) - 6;
            
            if (xScale(d.year) > innerWidth - 35) {
                labelX = xScale(d.year) - 28;
            }
            if (yScale(d.value) < 25) {
                labelY = yScale(d.value) + 15;
            }
            
            g.append("text")
                .attr("class", "data-label")
                .attr("x", labelX)
                .attr("y", labelY)
                .attr("text-anchor", "start")
                .attr("font-size", "11px")
                .attr("fill", "#ffbc6e")
                .attr("font-weight", "bold")
                .attr("opacity", 0)
                // .text(d.value)  // Commented out as requested
                .transition()
                .duration(200)
                .attr("opacity", 0.9);
        });
    }, lineAnimationDuration);
    
    // Draw trendline
    const trendlineDelay = lineAnimationDuration + 300;
    const trendlinePath = g.append("path")
        .attr("class", "trendline")
        .attr("fill", "none")
        .attr("stroke", "#E25822")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6,4")
        .attr("opacity", 0)
        .attr("d", lineGenerator(trendlineData));
    
    setTimeout(() => {
        trendlinePath.transition()
            .duration(300)
            .attr("opacity", 1)
            .on("end", () => {
                const trendlineLength = trendlinePath.node().getTotalLength();
                trendlinePath.attr("stroke-dasharray", trendlineLength + " " + trendlineLength)
                    .attr("stroke-dashoffset", trendlineLength)
                    .transition()
                    .duration(1500)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
            });
    }, trendlineDelay);
    
    // X-axis
    g.append("line")
        .attr("x1", 0)
        .attr("y1", innerHeight)
        .attr("x2", innerWidth)
        .attr("y2", innerHeight)
        .attr("stroke", "#ffbc6e")
        .attr("stroke-width", 1.5);
    
    g.append("polygon")
        .attr("points", `${innerWidth - 8},${innerHeight - 4} ${innerWidth},${innerHeight} ${innerWidth - 8},${innerHeight + 4}`)
        .attr("fill", "#ffbc6e");
    
    const xTickValues = [1950, 1955, 1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015];
    xTickValues.forEach(year => {
        const xPos = xScale(year);
        
        g.append("line")
            .attr("x1", xPos)
            .attr("y1", innerHeight - 5)
            .attr("x2", xPos)
            .attr("y2", innerHeight + 2)
            .attr("stroke", "#888")
            .attr("stroke-width", 1);
        
        g.append("text")
            .attr("x", xPos)
            .attr("y", innerHeight + 22)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "500")
            .attr("fill", "#aaa")
            .text(year);
    });
    
    g.append("text")
        .attr("x", innerWidth + 10)
        .attr("y", innerHeight - 8)
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("fill", "#ffbc6e")
        .attr("font-weight", "bold")
        .text("Year");
    
    console.log('Line graph initialized - nodes appear all at once with detailed tooltips');
}