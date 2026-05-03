        // ============================================================
        // FLEXIBLE SLIDE ARCHITECTURE
        // Each slide is a self-contained div inside .fixed-narrative-andy
        // You can design each slide ANY WAY YOU WANT
        // ============================================================
        (function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initFifthNarrative);
            } else {
                initFifthNarrative();
            }
            
            function initFifthNarrative() {
                console.log("ANDYYY init");
                

                function renderbubbleChartAndy() {
                    console.log("I tried bubble chart render.");
                    if (window._bubbleRendered) return;
                    window._bubbleRendered = true;

                    const data = [ 
                        { name: "Bess Flowers", nonOscar: 90, oscarBait: 5, image: "images/actors/bess_flowers.jpg" },
                        { name: "Irving Bacon", nonOscar: 34, oscarBait: 0, image: "images/actors/irving_bacon.jpg" },
                        { name: "Bing Crosby", nonOscar: 30, oscarBait: 1, image: "images/actors/bing_crosby.jpg" },
                        { name: "Spencer Tracy", nonOscar: 28, oscarBait: 1, image: "images/actors/spencer_tracy.jpg" },
                        { name: "Sam Harris", nonOscar: 29, oscarBait: 0, image: "images/actors/sam_harris.jpg" },
                        { name: "Meryl Streep", nonOscar: 25, oscarBait: 4, image: "images/actors/meryl_streep.jpg" },
                        { name: "Gino Corrado", nonOscar: 29, oscarBait: 0, image: "images/actors/gino_corrado.jpg" },
                        { name: "Cary Grant", nonOscar: 28, oscarBait: 1, image: "images/actors/cary_grant.jpg" },
                        { name: "James Stewart", nonOscar: 25, oscarBait: 3, image: "images/actors/james_stewart.jpg" },
                        { name: "Gary Cooper", nonOscar: 28, oscarBait: 0, image: "images/actors/gary_cooper.jpg" },
                        { name: "Robert De Niro", nonOscar: 20, oscarBait: 7, image: "images/actors/robert_de_niro.jpg" },
                        { name: "Dustin Hoffman", nonOscar: 25, oscarBait: 2, image: "images/actors/dustin_hoffman.jpg" },
                        { name: "Charlton Heston", nonOscar: 21, oscarBait: 6, image: "images/actors/charlton_heston.jpg" },
                        { name: "Ward Bond", nonOscar: 26, oscarBait: 0, image: "images/actors/ward_bond.jpg" },
                        { name: "John George", nonOscar: 23, oscarBait: 3, image: "images/actors/john_george.jpg" },
                        { name: "Jack Lemmon", nonOscar: 25, oscarBait: 1, image: "images/actors/jack_lemmon.jpg" },
                        { name: "Gregory Peck", nonOscar: 26, oscarBait: 0, image: "images/actors/gregory_peck.jpg" },
                        { name: "Bette Davis", nonOscar: 23, oscarBait: 3, image: "images/actors/bette_davis.jpg" },
                        { name: "Alan Hale", nonOscar: 23, oscarBait: 3, image: "images/actors/alan_hale.jpg" },
                        { name: "Charles Lane", nonOscar: 25, oscarBait: 0, image: "images/actors/charles_lane.jpg" }
                    ];

                    // Uniform scale: larger canvas + proportionally larger radii/strokes (same visual ratios)
                    const layoutScale = 1.25;
                    const width = 600 * layoutScale;
                    const height = 520 * layoutScale;

                    const svg = d3.select("#bubbleChartAndy")
                        .attr("viewBox", `0 0 ${width} ${height}`)
                        .attr("width", "100%")
                        .attr("height", String(height))
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("overflow", "visible");

                    // ✅ nodes
                    const nodes = data.map(d => ({
                        ...d,
                        total: d.nonOscar + d.oscarBait,
                        r: Math.sqrt(d.nonOscar + d.oscarBait) * 7.0 * layoutScale,
                        patternId: `actor-${d.name.toLowerCase().replace(/\s+/g, "-")}`
                    }));

                    const actorSelect = d3.select("#actorJumpSelect");
                    const selectedActorInfo = d3.select("#selectedActorInfo");
                    actorSelect.selectAll("option.actor-option")
                        .data([...nodes].sort((a, b) => d3.ascending(a.name, b.name)))
                        .enter()
                        .append("option")
                        .attr("class", "actor-option")
                        .attr("value", d => d.name)
                        .text(d => d.name);

                    // Image patterns for circle fills
                    const defs = svg.append("defs");
                    const patterns = defs.selectAll("pattern")
                        .data(nodes.filter(d => d.image))
                        .enter()
                        .append("pattern")
                        .attr("id", d => d.patternId)
                        .attr("patternUnits", "objectBoundingBox")
                        .attr("width", 1)
                        .attr("height", 1);

                    patterns.append("image")
                        .attr("href", d => d.image)
                        .attr("width", d => d.r * 2)
                        .attr("height", d => d.r * 2)
                        .attr("preserveAspectRatio", "xMidYMid slice");

                    // ✅ tooltip
                    const tooltip = d3.select("body")
                        .append("div")
                        .style("position", "absolute")
                        .style("background", "rgba(12, 15, 22, 0.96)")
                        .style("color", "#fff")
                        .style("padding", "10px")
                        .style("border-radius", "12px")
                        .style("border", "1px solid rgba(255, 188, 110, 0.5)")
                        .style("box-shadow", "0 14px 30px rgba(0, 0, 0, 0.45)")
                        .style("font-size", "13px")
                        .style("line-height", "1.45")
                        .style("pointer-events", "none")
                        .style("opacity", 0)
                        .style("z-index", 1000);

                    const pie = d3.pie()
                        .value(d => d.value)
                        .sort(null);

                    const pieColors = d3.scaleOrdinal()
                        .domain(["nonOscar", "oscarBait"])
                        .range(["rgba(40, 94, 143, 0.38)", "rgba(255, 157, 51, 0.58)"]);

                    // ✅ node groups
                    const nodeGroups = svg.selectAll(".bubble-node")
                        .data(nodes)
                        .enter()
                        .append("g")
                        .attr("class", "bubble-node")
                        .style("cursor", "pointer")

                    // Inset factor: pie sits slightly inside the gold ring so strokes don’t stack (fixes “double circle”)
                    const pieInset = 2.8 * layoutScale;

                    // Dim actor photo background
                    nodeGroups.append("circle")
                        .attr("class", "photo-bg")
                        .attr("r", d => d.r)
                        .attr("fill", d => d.image ? `url(#${d.patternId})` : "#304963")
                        .style("opacity", d => d.image ? 1 : 0.85);

                    // Pie slices on top of actor photos
                    nodeGroups.each(function(d) {
                        const outerR = Math.max(d.r - pieInset, d.r * 0.86);
                        const arc = d3.arc().innerRadius(0).outerRadius(outerR);
                        const slices = [
                            { key: "nonOscar", value: d.nonOscar },
                            { key: "oscarBait", value: d.oscarBait }
                        ].filter(item => item.value > 0);

                        d3.select(this)
                            .selectAll("path.pie-slice")
                            .data(pie(slices))
                            .enter()
                            .append("path")
                            .attr("class", "pie-slice")
                            .attr("d", arc)
                            .attr("fill", seg => pieColors(seg.data.key))
                            .style("stroke", "none");
                    });

                    // Outline ring (no drop-shadow — filter duplicates edges at small radii)
                    nodeGroups.append("circle")
                        .attr("class", "bubble-outline")
                        .attr("r", d => d.r)
                        .attr("fill", "none")
                        .style("stroke", "#ffbc6e")
                        .style("stroke-width", 2.2 * layoutScale);

                    // Center labels
                    const labels = nodeGroups.append("text")
                        .attr("class", "label")
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .style("pointer-events", "none")
                        .style("fill", "#fff")
                        .style("paint-order", "stroke")
                        .style("stroke", "rgba(0,0,0,0.72)")
                        .style("stroke-width", 2.5 * layoutScale)
                        .style("font-weight", "700")
                        .style("font-size", d => `${Math.max(9 * layoutScale, Math.min(d.r / 3.3, 13 * layoutScale))}px`);

                    // Right-side legend — vertically aligned with bubble cluster (force center is height/2)
                    const legendBlockApproxHalf = 38 * layoutScale;
                    const legendY = height / 2 - legendBlockApproxHalf;
                    const legendX = width - 108 * layoutScale;
                    const legend = svg.append("g")
                        .attr("class", "bubble-legend")
                        .attr("transform", `translate(${legendX}, ${legendY})`);

                    legend.append("text")
                        .attr("x", 0)
                        .attr("y", 0)
                        .style("fill", "#f2f2f2")
                        .style("font-size", `${13 * layoutScale}px`)
                        .style("font-weight", "700")
                        .text("Legend");

                    const legendItems = [
                        { key: "oscarBait", label: "Oscar-bait count" },
                        { key: "nonOscar", label: "Non-oscar bait count" }
                    ];

                    legend.selectAll(".legend-item")
                        .data(legendItems)
                        .enter()
                        .append("g")
                        .attr("class", "legend-item")
                        .attr("transform", (_, i) => `translate(0, ${16 * layoutScale + i * 22 * layoutScale})`)
                        .each(function(item) {
                            const row = d3.select(this);
                            row.append("rect")
                                .attr("width", 12 * layoutScale)
                                .attr("height", 12 * layoutScale)
                                .attr("rx", 2 * layoutScale)
                                .attr("fill", pieColors(item.key))
                                .attr("stroke", "rgba(255,255,255,0.7)");
                            row.append("text")
                                .attr("x", 18 * layoutScale)
                                .attr("y", 10 * layoutScale)
                                .style("fill", "#f2f2f2")
                                .style("font-size", `${10 * layoutScale}px`)
                                .text(item.label);
                        });

                    labels.each(function(d) {
                        const text = d3.select(this);
                        const words = d.name.split(" ");
                        text.selectAll("tspan").remove();
                        const lineHeight = 12 * layoutScale;
                        const offset = -(words.length - 1) * lineHeight / 2;

                        words.forEach((word, i) => {
                            text.append("tspan")
                                .attr("x", 0)
                                .attr("dy", i === 0 ? offset : lineHeight)
                                .text(word);
                        });
                    });

                    function setTooltipContent(d) {
                        const tooltipImage = d.image
                            ? `<img src="${d.image}" alt="${d.name}" style="width: 72px; height: 72px; object-fit: cover; border-radius: 50%; border: 2px solid rgba(255, 188, 110, 0.85); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35); flex: 0 0 auto;">`
                            : "";

                        tooltip.html(
                            `<div style="display: flex; align-items: center; gap: 11px; min-width: 220px;">` +
                                tooltipImage +
                                `<div>` +
                                    `<strong style="display: block; margin-bottom: 4px; color: #ffcf87; font-size: 14px;">${d.name}</strong>` +
                                    `<div>Non-oscar bait: ${d.nonOscar}</div>` +
                                    `<div>Oscar bait: ${d.oscarBait}</div>` +
                                    `<div>Total: ${d.total}</div>` +
                                `</div>` +
                            `</div>`
                        );
                    }

                    function setSelectedActorInfo(d) {
                        if (!d) {
                            selectedActorInfo.html(`<div class="selected-actor-placeholder">Select a name to see the actor's stats.</div>`);
                            return;
                        }

                        const infoImage = d.image
                            ? `<img class="selected-actor-photo" src="${d.image}" alt="${d.name}">`
                            : "";

                        selectedActorInfo.html(
                            `${infoImage}` +
                            `<div class="selected-actor-copy">` +
                                `<strong>${d.name}</strong>` +
                                `<span>Non-oscar bait: ${d.nonOscar}</span>` +
                                `<span>Oscar bait: ${d.oscarBait}</span>` +
                                `<span>Total: ${d.total}</span>` +
                            `</div>`
                        );
                    }

                    function focusActor(d, selectedElement, tooltipPosition) {
                        const others = nodeGroups.filter(n => n !== d);

                        others.selectAll(".photo-bg")
                            .transition().duration(180)
                            .style("opacity", 0.22);
                        others.selectAll(".pie-slice")
                            .transition().duration(180)
                            .style("opacity", 0.22);
                        others.selectAll(".bubble-outline")
                            .transition().duration(180)
                            .style("opacity", 0.25);
                        others.selectAll(".label")
                            .transition().duration(180)
                            .style("opacity", 0.35);

                        const selected = selectedElement ? d3.select(selectedElement) : nodeGroups.filter(n => n === d);
                        selected
                            .transition().duration(200)
                            .style("opacity", 1);
                        selected.select(".bubble-outline")
                            .transition().duration(200)
                            .style("stroke-width", 3.2 * layoutScale)
                            .style("stroke", "#ffd494");
                        selected.select(".photo-bg").style("opacity", 1);
                        selected.selectAll(".pie-slice").style("opacity", 1);
                        selected.select(".bubble-outline").style("opacity", 1);
                        selected.select(".label").style("opacity", 1);

                        if (tooltipPosition) {
                            setTooltipContent(d);
                            tooltip
                                .style("opacity", 1)
                                .style("left", tooltipPosition.left + "px")
                                .style("top", tooltipPosition.top + "px");
                        }
                    }

                    function resetActorFocus() {
                        nodeGroups.selectAll(".photo-bg")
                            .transition().duration(180)
                            .style("opacity", 1);
                        nodeGroups.selectAll(".pie-slice")
                            .transition().duration(180)
                            .style("opacity", 1);
                        nodeGroups.selectAll(".bubble-outline")
                            .transition().duration(180)
                            .style("opacity", 1)
                            .style("stroke-width", 2.2 * layoutScale)
                            .style("stroke", "#ffbc6e");
                        nodeGroups.selectAll(".label")
                            .transition().duration(180)
                            .style("opacity", 1);

                        nodeGroups.style("opacity", 1);
                        tooltip.style("opacity", 0);
                    }

                    nodeGroups
                        .on("mouseover", function(event, d) {
                            actorSelect.property("value", d.name);
                            focusActor(d, this, {
                                left: event.pageX + 10,
                                top: event.pageY - 20
                            });
                        })

                        .on("mousemove", (event) => {
                        tooltip
                            .style("left", event.pageX + 10 + "px")
                            .style("top", event.pageY - 20 + "px");
                        })

                        .on("mouseout", function() {
                            if (actorSelect.property("value")) {
                                tooltip.style("opacity", 0);
                                return;
                            }

                            resetActorFocus();
                        });

                    actorSelect.on("change", function() {
                        const selectedName = this.value;
                        if (!selectedName) {
                            setSelectedActorInfo(null);
                            resetActorFocus();
                            return;
                        }

                        const selectedActor = nodes.find(d => d.name === selectedName);
                        if (!selectedActor) return;

                        setSelectedActorInfo(selectedActor);
                        tooltip.style("opacity", 0);
                        focusActor(selectedActor, null, null);
                    });



                    // Center cluster left; legend group stays at fixed x (right of viewBox)
                    const clusterX = width * 0.355;
                    const simulation = d3.forceSimulation(nodes)
                        .force("center", d3.forceCenter(clusterX, height / 2))
                        .force("x", d3.forceX(clusterX).strength(0.1))
                        .force("y", d3.forceY(height / 2).strength(0.09))
                        .force("charge", d3.forceManyBody().strength(2.5))
                        .force("collision", d3.forceCollide().radius(d => d.r + 4 * layoutScale))
                        .on("tick", () => {
                        nodeGroups
                            .attr("transform", d => `translate(${Math.round(d.x)}, ${Math.round(d.y)})`);
                        });
                    }

                function renderOscarBaitBarChart() {
                    if (window._oscarBaitBarRendered) return;
                    window._oscarBaitBarRendered = true;

                    const rows = [
                        { name: "Robert De Niro", oscarBait: 7, image: "images/actors/robert_de_niro.jpg" },
                        { name: "Charlton Heston", oscarBait: 6, image: "images/actors/charlton_heston.jpg" },
                        { name: "Bess Flowers", oscarBait: 5, image: "images/actors/bess_flowers.jpg" },
                        { name: "Meryl Streep", oscarBait: 4, image: "images/actors/meryl_streep.jpg" },
                        { name: "James Stewart", oscarBait: 3, image: "images/actors/james_stewart.jpg" },
                        { name: "John George", oscarBait: 3, image: "images/actors/john_george.jpg" },
                        { name: "Bette Davis", oscarBait: 3, image: "images/actors/bette_davis.jpg" },
                        { name: "Alan Hale", oscarBait: 3, image: "images/actors/alan_hale.jpg" },
                        { name: "Dustin Hoffman", oscarBait: 2, image: "images/actors/dustin_hoffman.jpg" },
                        { name: "Spencer Tracy", oscarBait: 1, image: "images/actors/spencer_tracy.jpg" },
                        { name: "Jack Lemmon", oscarBait: 1, image: "images/actors/jack_lemmon.jpg" },
                        { name: "Cary Grant", oscarBait: 1, image: "images/actors/cary_grant.jpg" },
                        { name: "Bing Crosby", oscarBait: 1, image: "images/actors/bing_crosby.jpg" }
                    ].map(d => ({
                        ...d,
                        patternId: `bar-${d.name.toLowerCase().replace(/\s+/g, "-")}`
                    }));

                    const thumbR = 15;
                    const margin = { top: 40, right: 40, bottom: 44, left: 172 };
                    const width = 680;
                    const rowGap = 38;
                    const innerH = rows.length * rowGap;
                    const height = margin.top + margin.bottom + innerH;
                    const innerW = width - margin.left - margin.right;

                    const svg = d3.select("#oscarBaitBarChart")
                        .attr("viewBox", `0 0 ${width} ${height}`)
                        .attr("width", "100%")
                        .attr("height", height)
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("overflow", "visible");

                    const defs = svg.append("defs");
                    defs.selectAll("pattern.bar-thumb")
                        .data(rows.filter(d => d.image))
                        .enter()
                        .append("pattern")
                        .attr("class", "bar-thumb")
                        .attr("id", d => d.patternId)
                        .attr("patternUnits", "objectBoundingBox")
                        .attr("width", 1)
                        .attr("height", 1)
                        .append("image")
                        .attr("href", d => d.image)
                        .attr("width", thumbR * 2)
                        .attr("height", thumbR * 2)
                        .attr("preserveAspectRatio", "xMidYMid slice");

                    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

                    const xMax = 8;
                    const x = d3.scaleLinear().domain([0, xMax]).range([0, innerW]);
                    const y = d3.scaleBand()
                        .domain(rows.map(d => d.name))
                        .range([0, innerH])
                        .padding(0.22);

                    g.selectAll(".x-grid")
                        .data(x.ticks(9))
                        .enter()
                        .append("line")
                        .attr("x1", d => x(d))
                        .attr("x2", d => x(d))
                        .attr("y1", 0)
                        .attr("y2", innerH)
                        .attr("stroke", "rgba(255,255,255,0.07)")
                        .attr("stroke-dasharray", "3,3");

                    g.selectAll(".actor-thumb")
                        .data(rows)
                        .enter()
                        .append("circle")
                        .attr("class", "actor-thumb")
                        .attr("cx", -margin.left + thumbR + 4)
                        .attr("cy", d => y(d.name) + y.bandwidth() / 2)
                        .attr("r", thumbR)
                        .attr("fill", d => d.image ? `url(#${d.patternId})` : "#304963")
                        .style("stroke", "rgba(255,188,110,0.45)")
                        .style("stroke-width", 1);

                    g.selectAll(".y-label")
                        .data(rows)
                        .enter()
                        .append("text")
                        .attr("class", "y-label")
                        .attr("x", -margin.left + thumbR * 2 + 12)
                        .attr("y", d => y(d.name) + y.bandwidth() / 2)
                        .attr("dy", "0.35em")
                        .attr("text-anchor", "start")
                        .style("fill", "#c9d4e8")
                        .style("font-size", "12px")
                        .style("font-weight", "500")
                        .text(d => d.name);

                    g.selectAll(".bar")
                        .data(rows)
                        .enter()
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", d => y(d.name))
                        .attr("width", d => x(d.oscarBait))
                        .attr("height", y.bandwidth())
                        .attr("fill", "#ff9d33")
                        .attr("rx", 2)
                        .attr("opacity", 0.92);

                    g.selectAll(".bar-value")
                        .data(rows)
                        .enter()
                        .append("text")
                        .attr("class", "bar-value")
                        .attr("x", d => (d.oscarBait === 0 ? 6 : x(d.oscarBait) + 5))
                        .attr("y", d => y(d.name) + y.bandwidth() / 2)
                        .attr("dy", "0.35em")
                        .style("fill", "#eef2ff")
                        .style("font-size", "12px")
                        .style("font-weight", "600")
                        .text(d => d.oscarBait);

                    const xa = d3.axisBottom(x).ticks(8).tickSizeOuter(0);
                    g.append("g")
                        .attr("transform", `translate(0,${innerH})`)
                        .call(xa)
                        .call(sel => sel.selectAll("path").attr("stroke", "rgba(255,255,255,0.2)"))
                        .call(sel => sel.selectAll("line").attr("stroke", "rgba(255,255,255,0.2)"))
                        .call(sel => sel.selectAll("text").attr("fill", "#aab6cc").style("font-size", "11px"));

                    svg.append("text")
                        .attr("x", margin.left + innerW / 2)
                        .attr("y", height - 10)
                        .attr("text-anchor", "middle")
                        .style("fill", "#aab6cc")
                        .style("font-size", "11px")
                        .text("Oscar bait count");

                    svg.append("text")
                        .attr("transform", `translate(14, ${margin.top + innerH / 2}) rotate(-90)`)
                        .attr("text-anchor", "middle")
                        .style("fill", "#aab6cc")
                        .style("font-size", "11px")
                        .text("Actor name");
                }

                function renderOscarBaitRatioChart() {
                    if (window._oscarBaitRatioRendered) return;
                    window._oscarBaitRatioRendered = true;

                    const rows = [
                        { name: "Robert De Niro", nonOscar: 20, oscarBait: 7, image: "images/actors/robert_de_niro.jpg" },
                        { name: "Charlton Heston", nonOscar: 21, oscarBait: 6, image: "images/actors/charlton_heston.jpg" },
                        { name: "Bess Flowers", nonOscar: 90, oscarBait: 5, image: "images/actors/bess_flowers.jpg" },
                        { name: "Meryl Streep", nonOscar: 25, oscarBait: 4, image: "images/actors/meryl_streep.jpg" },
                        { name: "James Stewart", nonOscar: 25, oscarBait: 3, image: "images/actors/james_stewart.jpg" },
                        { name: "John George", nonOscar: 23, oscarBait: 3, image: "images/actors/john_george.jpg" },
                        { name: "Bette Davis", nonOscar: 23, oscarBait: 3, image: "images/actors/bette_davis.jpg" },
                        { name: "Alan Hale", nonOscar: 23, oscarBait: 3, image: "images/actors/alan_hale.jpg" },
                        { name: "Dustin Hoffman", nonOscar: 25, oscarBait: 2, image: "images/actors/dustin_hoffman.jpg" },
                        { name: "Spencer Tracy", nonOscar: 28, oscarBait: 1, image: "images/actors/spencer_tracy.jpg" },
                        { name: "Jack Lemmon", nonOscar: 25, oscarBait: 1, image: "images/actors/jack_lemmon.jpg" },
                        { name: "Cary Grant", nonOscar: 28, oscarBait: 1, image: "images/actors/cary_grant.jpg" },
                        { name: "Bing Crosby", nonOscar: 30, oscarBait: 1, image: "images/actors/bing_crosby.jpg" }
                    ].map(d => ({
                        ...d,
                        total: d.nonOscar + d.oscarBait,
                        ratio: d.oscarBait / (d.nonOscar + d.oscarBait),
                        patternId: `ratio-${d.name.toLowerCase().replace(/\s+/g, "-")}`
                    })).sort((a, b) => d3.descending(a.ratio, b.ratio));

                    const thumbR = 17;
                    const margin = { top: 38, right: 78, bottom: 48, left: 178 };
                    const width = 700;
                    const rowGap = 41;
                    const innerH = rows.length * rowGap;
                    const height = margin.top + margin.bottom + innerH;
                    const innerW = width - margin.left - margin.right;

                    const svg = d3.select("#oscarBaitRatioChart")
                        .attr("viewBox", `0 0 ${width} ${height}`)
                        .attr("width", "100%")
                        .attr("height", height)
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("overflow", "visible");

                    const defs = svg.append("defs");
                    defs.selectAll("pattern.ratio-thumb")
                        .data(rows.filter(d => d.image))
                        .enter()
                        .append("pattern")
                        .attr("class", "ratio-thumb")
                        .attr("id", d => d.patternId)
                        .attr("patternUnits", "objectBoundingBox")
                        .attr("width", 1)
                        .attr("height", 1)
                        .append("image")
                        .attr("href", d => d.image)
                        .attr("width", thumbR * 2)
                        .attr("height", thumbR * 2)
                        .attr("preserveAspectRatio", "xMidYMid slice");

                    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
                    const x = d3.scaleLinear().domain([0, 0.28]).range([0, innerW]);
                    const y = d3.scaleBand()
                        .domain(rows.map(d => d.name))
                        .range([0, innerH])
                        .padding(0.24);
                    const ratioSaturation = d3.scaleLinear()
                        .domain(d3.extent(rows, d => d.ratio))
                        .range([38, 100]);

                    g.selectAll(".ratio-grid")
                        .data(x.ticks(7))
                        .enter()
                        .append("line")
                        .attr("x1", d => x(d))
                        .attr("x2", d => x(d))
                        .attr("y1", 0)
                        .attr("y2", innerH)
                        .attr("stroke", "rgba(255,255,255,0.08)")
                        .attr("stroke-dasharray", "3,3");

                    g.selectAll(".actor-thumb")
                        .data(rows)
                        .enter()
                        .append("circle")
                        .attr("class", "actor-thumb")
                        .attr("cx", -margin.left + thumbR + 4)
                        .attr("cy", d => y(d.name) + y.bandwidth() / 2)
                        .attr("r", thumbR)
                        .attr("fill", d => d.image ? `url(#${d.patternId})` : "#304963")
                        .style("stroke", "rgba(255,188,110,0.55)")
                        .style("stroke-width", 1.2);

                    g.selectAll(".ratio-y-label")
                        .data(rows)
                        .enter()
                        .append("text")
                        .attr("class", "ratio-y-label")
                        .attr("x", -margin.left + thumbR * 2 + 13)
                        .attr("y", d => y(d.name) + y.bandwidth() / 2)
                        .attr("dy", "0.35em")
                        .attr("text-anchor", "start")
                        .style("fill", "#d5def2")
                        .style("font-size", "12px")
                        .style("font-weight", "600")
                        .text(d => d.name);

                    g.selectAll(".ratio-bar-bg")
                        .data(rows)
                        .enter()
                        .append("rect")
                        .attr("class", "ratio-bar-bg")
                        .attr("x", 0)
                        .attr("y", d => y(d.name))
                        .attr("width", innerW)
                        .attr("height", y.bandwidth())
                        .attr("rx", 6)
                        .attr("fill", "rgba(255,255,255,0.06)");

                    g.selectAll(".ratio-bar")
                        .data(rows)
                        .enter()
                        .append("rect")
                        .attr("class", "ratio-bar")
                        .attr("x", 0)
                        .attr("y", d => y(d.name))
                        .attr("width", d => x(d.ratio))
                        .attr("height", y.bandwidth())
                        .attr("rx", 6)
                        .attr("fill", d => `hsl(31, ${ratioSaturation(d.ratio)}%, 56%)`)
                        .attr("opacity", 0.96);

                    g.selectAll(".ratio-value")
                        .data(rows)
                        .enter()
                        .append("text")
                        .attr("class", "ratio-value")
                        .attr("x", d => x(d.ratio) + 8)
                        .attr("y", d => y(d.name) + y.bandwidth() / 2)
                        .attr("dy", "0.35em")
                        .style("fill", "#eef2ff")
                        .style("font-size", "12px")
                        .style("font-weight", "700")
                        .text(d => `${d3.format(".1%")(d.ratio)} (${d.oscarBait}/${d.total})`);

                    const xa = d3.axisBottom(x)
                        .ticks(7)
                        .tickFormat(d3.format(".0%"))
                        .tickSizeOuter(0);
                    g.append("g")
                        .attr("transform", `translate(0,${innerH})`)
                        .call(xa)
                        .call(sel => sel.selectAll("path").attr("stroke", "rgba(255,255,255,0.2)"))
                        .call(sel => sel.selectAll("line").attr("stroke", "rgba(255,255,255,0.2)"))
                        .call(sel => sel.selectAll("text").attr("fill", "#aab6cc").style("font-size", "11px"));

                    svg.append("text")
                        .attr("x", margin.left + innerW / 2)
                        .attr("y", height - 10)
                        .attr("text-anchor", "middle")
                        .style("fill", "#aab6cc")
                        .style("font-size", "11px")
                        .text("Oscar-bait films as percentage of total actor appearances (Max. 100%)");
                }

                // DOM elements
                const scrollFifthContainer = document.getElementById('scrollFifthContainer');
                const slides = document.querySelectorAll('.narrative-slide-andy');
                const triggerSteps = document.querySelectorAll('#FifthTriggerContainer .trigger-step');
                // const progressPill = document.getElementById('progressPill');
                // const scrollHint = document.getElementById('scrollHint');
                
                const totalSlides = slides.length; // Should be 3
                console.log(`Total slides: ${totalSlides}`);
                
                const slideNames = [
                    "Image", "Blind spot", "Widening gap"];
                
                let currentActiveIndex = 0;
                if (scrollFifthContainer) {
                    scrollFifthContainer.classList.add('visible');
                    scrollFifthContainer.style.opacity = '1';
                    scrollFifthContainer.style.visibility = 'visible';
                }
                // Function to activate a slide (crossfade)
                function activateSlide(index) {
                    if (index < 0 || index >= totalSlides) return;
                    if (index === currentActiveIndex && slides[index].classList.contains("active")) return;
                    
                    // Crossfade slides
                    slides.forEach((slide, i) => {
                        if (i === index) {
                            slide.classList.add('active');
                        } else {
                            slide.classList.remove('active');
                        }
                    });
                    
                    // Update progress pill
                    // progressPill.innerHTML = `🎬 ${slideNames[index]} · ${index+1}/${totalSlides}`;
                    
                    // // Update scroll hint
                    // if (index === totalSlides - 1) {
                    //     scrollHint.innerHTML = '🏁 End of narrative — scroll up to revisit';
                    //     scrollHint.style.color = '#ffbc6e';
                    // } else {
                    //     scrollHint.innerHTML = `↓ scroll to next: ${slideNames[index+1]}`;
                    //     scrollHint.style.color = '#aaa';
                    // }
                    
                    currentActiveIndex = index;
                    console.log(`ANDY Activated slide ${index+1}: ${slideNames[index]}`);

                    if (currentActiveIndex === 0) {
                        renderbubbleChartAndy();
                    }
                    if (currentActiveIndex === 1) {
                        renderOscarBaitBarChart();
                    }
                    if (currentActiveIndex === 2) {
                        renderOscarBaitRatioChart();
                    }
                }
                
                // ========== firstintro SCROLL TRANSITION ==========
                // function checkfirstintroScroll() {
                //     if (!firstintro) return;
                //     const firstintroBottom = firstintro.getBoundingClientRect().bottom;
                    
                //     if (firstintroBottom <= 0) {
                //         if (scrollFifthContainer && !scrollFifthContainer.classList.contains('visible')) {
                //             scrollFifthContainer.classList.add('visible');
                //             console.log("firstintro scrolled past — narrative revealed");
                //             if (scrollerAndy) setTimeout(() => scrollerAndy.resize(), 100);
                //         }
                //     } else {
                //         if (scrollFifthContainer && scrollFifthContainer.classList.contains('visible')) {
                //             scrollFifthContainer.classList.remove('visible');
                //         }
                //     }
                // }
                
                // ========== SCROLLAMA SETUP ==========
                let scrollerAndy = null;
                
                function setupScrollama() {
                    // Check if scrollama is available
                    if (typeof scrollama === 'undefined') {
                        console.warn("⚠️ Scrollama not loaded, retrying...");
                        setTimeout(setupScrollama, 500);
                        return;
                    }
                    
                    // Destroy existing instance
                    if (scrollerAndy) {
                        scrollerAndy.destroy();
                        scrollerAndy = null;
                    }
                    scrollerAndy = scrollama();
                    
                    scrollerAndy
                        .setup({
                            step: '#FifthTriggerContainer .trigger-step',
                            offset: 0.55,
                            threshold: 0.2,
                            debug: false
                        })
                        .onStepEnter(response => {
                            const triggerIndex = response.index;
                            
                    
                            if (triggerIndex === 0) {
                                renderbubbleChartAndy();
                            }
                            if (triggerIndex === 1) {
                                renderOscarBaitBarChart();
                            }
                            if (triggerIndex === 2) {
                                renderOscarBaitRatioChart();
                            }

                            if (triggerIndex >= 0 && triggerIndex < totalSlides) {
                                if (triggerIndex !== currentActiveIndex) {
                                    activateSlide(triggerIndex);
                                }
                            }
                        })
                        .onStepExit(response => {
                            const exitingIndex = response.index;
                            const direction = response.direction;
                            
                            if (direction === 'up' && exitingIndex > 0) {
                                const prevIndex = exitingIndex - 1;
                                if (prevIndex !== currentActiveIndex && prevIndex >= 0) {
                                    const prevTrigger = triggerSteps[prevIndex];
                                    if (prevTrigger) {
                                        const rect = prevTrigger.getBoundingClientRect();
                                        const viewportMid = window.innerHeight * 0.55;
                                        if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
                                            activateSlide(prevIndex);
                                        }
                                    }
                                }
                            }
                            if (direction === 'up' && exitingIndex === 0) {
                                if (currentActiveIndex !== 0) {
                                    activateSlide(0);
                                }
                            }
                        });
                }
                
                setupScrollama();
                
                // Helper to determine active slide from scroll
                function determineActiveFromScroll() {
                    if (!scrollFifthContainer.classList.contains('visible')) return;
                    
                    const viewportMid = window.innerHeight * 0.55;
                    let bestIndex = 0;
                    triggerSteps.forEach((step, idx) => {
                        const rect = step.getBoundingClientRect();
                        if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
                            bestIndex = idx;
                        } else if (rect.top <= viewportMid && idx === 0 && rect.bottom > 0) {
                            bestIndex = 0;
                        }
                    });
                    if (bestIndex !== currentActiveIndex) {
                        activateSlide(bestIndex);
                    }
                }
                
                // ========== EVENT LISTENERS ==========
                // window.addEventListener('scroll', checkfirstintroScroll);
                // checkfirstintroScroll();
                
                let resizeTimer;
                window.addEventListener('resize', () => {
                    if (resizeTimer) clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        if (scrollerAndy) scrollerAndy.resize();
                        if (scrollFifthContainer.classList.contains('visible')) {
                            determineActiveFromScroll();
                        }
                    }, 200);
                });
                
                window.addEventListener('scroll', () => {
                    if (scrollFifthContainer.classList.contains('visible')) {
                        if (!window._scrollFrame) {
                            window._scrollFrame = requestAnimationFrame(() => {
                                determineActiveFromScroll();
                                window._scrollFrame = null;
                            });
                        }
                    }
                });
                
                // Initial activation
                setTimeout(() => {
                    // Force initial slide to be active
                    if (!scrollFifthContainer.classList.contains('visible')) {
                        // Even if hidden, pre-activate slide 0
                        activateSlide(0);
                    } else {
                        determineActiveFromScroll();
                    }
                    if (scrollerAndy) scrollerAndy.resize();
                }, 100);
                
                // Add style for smooth transitions
                const style = document.createElement('style');
                style.textContent = `
                    .narrative-slide-andy {
                        transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    }
                    .scroll-container-andy {
                        transition: opacity 0.7s ease;
                    }
                `;
                document.head.appendChild(style);
                
                console.log("✅ Ready! 3 custom slides:");
                console.log("  Slide 1: Image only");
                console.log("  Slide 2: Text only"); 
                console.log("  Slide 3: Text (LHS) + Image (RHS)");
                console.log("To customize: edit each .narrative-slide-andy div with your own HTML/CSS");
            

                // Make sure slide 1 is active immediately
                activateSlide(0);
                scrollFifthContainer.style.opacity = '1';

            }
        })();