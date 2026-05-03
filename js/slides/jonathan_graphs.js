
// Set dimensions and margins
const width = 1200; // Adjust width as needed
const height = 400; // Adjust height as needed

// Create the SVG container
const svg = d3.select("#tree-diagram")
.append("svg")
.attr("width", width)
.attr("height", height)
.style("font-family", "sans-serif");

// Load the JSON file
d3.json("Budget_Tree_Top_100.json").then(data => {
// Process the data into a hierarchical structure
const hierarchy = {
    name: "Movies",
    children: data.map(d => ({
        name: d["Movie Name"],
        value: +d.Budget, // Use Budget as the size
        oscarBaitCount: +d["Oscar Bait Count"] // Use Oscar Bait Count for color
    }))
};

// Create a hierarchy from the processed data
const root = d3.hierarchy(hierarchy)
    .sum(d => d.value) // Use the "value" property for sizing
    .sort((a, b) => b.value - a.value); // Sort by value

// Create a treemap layout
d3.treemap()
    .size([width, height])
    .padding(1)(root);

// Define a color scale for Oscar Bait Count
const colorScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d["Oscar Bait Count"])]) // Range of Oscar Bait Count
    .range(["#B69F66", "#801B1D"]); // Light blue to red

// Add rectangles for each node
const nodes = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

nodes.append("rect")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.oscarBaitCount)) // Color based on Oscar Bait Count
    .attr("stroke", "#fff");

// Add text labels
nodes.append("text")
    .attr("x", 4)
    .attr("y", 14)
    .text(d => d.data.name)
    .attr("fill", "white")
    .style("font-size", "10px")
    .style("pointer-events", "none");

// Add budget labels (optional)
nodes.append("text")
    .attr("x", 4)
    .attr("y", 28)
    .text(d => `$${d.data.value.toLocaleString()}`)
    .attr("fill", "white")
    .style("font-size", "8px")
    .style("pointer-events", "none");
});







d3.json("Oscar-Baiting_Directors.json").then(function(data) {
const width = 600, height = 600;

const svg = d3.select("#director-bubble")
.append("svg")
.attr("width", width)
.attr("height", height);

// Scale for bubble size (Oscar Count)
const sizeScale = d3.scaleSqrt()
.domain([0, d3.max(data, d => d["Oscar Count"])])
.range([5, 40]);

// Scale for bubble color (Oscar Bait Count)
const colorScale = d3.scaleLinear()
.domain([0, d3.max(data, d => d["Oscar Bait Count"])])
.range(["#D5BA6D", "#801B1D"]); // light gold → deep red

// Force simulation for bubble layout
const simulation = d3.forceSimulation(data)
.force("charge", d3.forceManyBody().strength(5))
.force("center", d3.forceCenter(width / 2, height / 2))
.force("collision", d3.forceCollide().radius(d => sizeScale(d["Oscar Count"]) + 2));

// Tooltip
const tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0)
.style("position", "absolute")
.style("background", "rgba(0,0,0,0.7)")
.style("color", "#ffbc6e")
.style("padding", "6px 10px")
.style("border-radius", "6px")
.style("pointer-events", "none");

// Draw bubbles
const nodes = svg.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("r", d => sizeScale(d["Oscar Count"]))
.attr("fill", d => colorScale(d["Oscar Bait Count"]))
.attr("stroke", "#fff")
.attr("stroke-width", 1.5)
.on("mouseover", function(event, d) {
d3.select(this).attr("stroke", "#FFD966").attr("stroke-width", 3);
tooltip.style("opacity", 1)
    .html(`<strong>${d["Person Name"]}</strong><br/>
        Oscars: ${d["Oscar Count"]}<br/>
        Oscar-bait Movies: ${d["Oscar Bait Count"]}`)
    .style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function() {
d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1.5);
tooltip.style("opacity", 0);
});

// Update positions on each tick
simulation.on("tick", () => {
nodes.attr("cx", d => d.x)
.attr("cy", d => d.y);
});
});






d3.json("Oscar-Baiting_Directors_Top_15.json").then(function(data) {
const margin = {top: 40, right: 20, bottom: 70, left: 60},
width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

const svg = d3.select("#director-barchart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

// X scale
const x = d3.scaleBand()
.domain(data.map(d => d["Person Name"]))
.range([0, width])
.padding(0.2);

// Y scale (max of Oscar Count)
const y = d3.scaleLinear()
.domain([0, d3.max(data, d => d["Oscar Count"])])
.nice()
.range([height, 0]);

// Ghost bar (Oscar Count)
svg.selectAll(".ghost-bar")
.data(data)
.enter()
.append("rect")
.attr("class", "ghost-bar")
.attr("x", d => x(d["Person Name"]))
.attr("y", d => y(d["Oscar Count"]))
.attr("width", x.bandwidth())
.attr("height", d => height - y(d["Oscar Count"]))
.attr("fill", "#ffb347")
.attr("opacity", 0.3);

// Solid bar (Oscar Bait Count)
svg.selectAll(".bait-bar")
.data(data)
.enter()
.append("rect")
.attr("class", "bait-bar")
.attr("x", d => x(d["Person Name"]))
.attr("y", d => y(d["Oscar Bait Count"]))
.attr("width", x.bandwidth())
.attr("height", d => height - y(d["Oscar Bait Count"]))
.attr("fill", "#ffb347");

// Ratio label on top of bait bar
svg.selectAll(".ratio-label")
.data(data)
.enter()
.append("text")
.attr("class", "ratio-label")
.attr("x", d => x(d["Person Name"]) + x.bandwidth()/2)
.attr("y", d => y(d["Oscar Bait Count"]) - 5)
.attr("text-anchor", "middle")
.attr("fill", "#FFD966")
.style("font-size", "12px")
.style("font-weight", "600")
.text(d => d["Oscar Bait Ratio"].toFixed(2));

// X Axis
svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "rotate(-40)")
.style("text-anchor", "end")
.style("fill", "#eef2ff");

// Y Axis
svg.append("g")
.call(d3.axisLeft(y));
});