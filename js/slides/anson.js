(function() {
            // Bubble chart state shared across slide transitions
            let genres_bubbleChartState = null;
            let currentActiveIndex = 0;
            let genres_bubbleEnterTimer = null;
            let genres_bubbleEnterPending = false;
            let genres_slide4Mode = 'nominated';
            let genres_slide4RankMode = 'count';
            let genres_slide4EnterStarted = false;
            const genres_debugSlide4 = false;
            let bubbleEnterPending = false;
            let slide4EnterStarted = false;

            function genres_slide4Debug(...args) {
                if (genres_debugSlide4) {
                    console.log('[genres_slide4]', ...args);
                }
            }

            function genres_setSlide4FilterMode(mode) {
                if (mode !== 'nominated' && mode !== 'nominated-rotten') return;
                genres_setSlide4Mode(mode);
            }

            function genres_setSlide4RankMode(mode) {
                if (mode !== 'count' && mode !== 'ratio') return;
                const previousMode = genres_slide4RankMode;
                genres_slide4RankMode = mode;
                if (genres_bubbleChartState) {
                    genres_animateRankModeTransition(previousMode, mode, genres_bubbleChartState.lastProgress || 0);
                }
            }

            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', genres_initFlexibleNarrative);
            } else {
                genres_initFlexibleNarrative();
            }
            
            function genres_initFlexibleNarrative() {
                console.log("🎬 Flexible slide architecture — 3 custom slides");
                
                // DOM elements
                const firstintro = document.getElementById('firstintroSection');
                const scrollThirdContainer = document.getElementById('scrollThirdContainer');
                const slides = document.querySelectorAll('#thirdFixedNarrative .narrative-slide-genres');
                const triggerSteps = document.querySelectorAll('.genres_trigger-step');
                // Toggle buttons removed — now automatic scrollytelling
                // const progressPill = document.getElementById('progressPill');
                // const scrollHint = document.getElementById('scrollHint');
                
                const totalSlides = slides.length; // Should be 3
                console.log(`Total slides: ${totalSlides}`);
                
                // Slide Type
                const slideNames = ["Text Only", "Genre Bubbles", "Placeholder"];
                
                currentActiveIndex = 0;

                function genres_updateSlide4FilterButton(mode) {
                    // Automatic mode switching — no UI button
                }

                function genres_updateSlide4RankButton(mode) {
                    // Automatic mode switching — no UI button
                }

                function genres_setSlide4FilterMode(mode) {
                    if (mode !== 'nominated' && mode !== 'nominated-rotten') return;
                    genres_setSlide4Mode(mode);
                    genres_updateSlide4FilterButton(mode);
                }

                function genres_setSlide4RankMode(mode) {
                    if (mode !== 'count' && mode !== 'ratio') return;
                    const previousMode = genres_slide4RankMode;
                    genres_slide4RankMode = mode;
                    genres_updateSlide4RankButton(mode);
                    if (genres_bubbleChartState) {
                        genres_animateRankModeTransition(previousMode, mode, genres_bubbleChartState.lastProgress || 0);
                    }
                }

                // Event listeners removed — automatic scrollytelling now controls filter/rank modes
                
                // Function to activate a slide (crossfade)
                function activateSlide(index) {
                    if (index < 0 || index >= totalSlides) return;
                    if (index === currentActiveIndex && document.querySelector('.narrative-slide-genres.active')?.getAttribute('data-slide') == index) return;

                    const previousIndex = currentActiveIndex;
                    
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
                    console.log(`Activated slide ${index+1}: ${slideNames[index]}`);

                    // Trigger the bubble chart when slide 1 becomes active
                    if (index === 1) {
                        genres_slide4Debug('activateSlide(1)', {
                            hasBubbleChart: !!genres_bubbleChartState,
                            slide4Mode: genres_slide4Mode,
                            slide4RankMode: genres_slide4RankMode,
                            bubbleEnterPending: genres_bubbleEnterPending,
                            slide4EnterStarted: genres_slide4EnterStarted
                        });
                        genres_buildGenreBubbleChart();
                        genres_setSlide4FilterMode('nominated');
                        genres_setSlide4RankMode('count');
                        genres_scheduleBubbleEnter();
                    }

                    // Trigger the bar chart when slide 5 becomes active
                    if (index === 2) {
                        setTimeout(() => {
                            genres_buildGenreBarChart();
                        }, 300);
                    }

                    // Play exit animation when leaving slide 4
                    if (previousIndex === 1 && index !== 1) {
                        genres_resetBubbleHoverState();
                        genres_startBubbleExitAnimation();
                        genres_clearBubbleEnterTimer();
                    }
                }
                
                // ========== firstintro SCROLL TRANSITION ==========
                // function checkfirstintroScroll() {
                //     if (!firstintro) return;
                //     const firstintroBottom = firstintro.getBoundingClientRect().bottom;
                    
                //     if (firstintroBottom <= 0) {
                //         if (scrollThirdContainer && !scrollThirdContainer.classList.contains('visible')) {
                //             scrollThirdContainer.classList.add('visible');
                //             console.log("firstintro scrolled past — narrative revealed");
                //             if (scroller) setTimeout(() => scroller.resize(), 100);
                //         }
                //     } else {
                //         if (scrollThirdContainer && scrollThirdContainer.classList.contains('visible')) {
                //             scrollThirdContainer.classList.remove('visible');
                //         }
                //     }
                // }
                
                // ========== SCROLLAMA SETUP ==========
                let scroller = null;
                
                function setupScrollama() {
                    if (scroller) scroller.destroy();
                    
                    scroller = scrollama();
                    
                    scroller
                        .setup({
                            step: '.genres_trigger-step',
                            offset: 0.55,
                            threshold: 0.2,
                            progress: true,
                            debug: false
                        })
                        .onStepEnter(response => {
                            const triggerIndex = response.index;
                            if (triggerIndex === 1) {
                                genres_slide4Debug('onStepEnter slide 4', {
                                    progress: response.progress,
                                    direction: response.direction,
                                    hasBubbleChart: !!genres_bubbleChartState,
                                    bubbleEnterPending: genres_bubbleEnterPending,
                                    slide4EnterStarted: genres_slide4EnterStarted
                                });
                            }
                            if (triggerIndex >= 0 && triggerIndex < totalSlides) {
                                if (triggerIndex !== currentActiveIndex) {
                                    activateSlide(triggerIndex);
                                }
                            }

                            // Enter slide 4 immediately: build the chart and start the gather animation right away.
                            if (triggerIndex === 1) {
                                genres_buildGenreBubbleChart();
                                genres_slide4EnterStarted = true;
                                genres_scheduleBubbleEnter();
                            }
                        })
                        .onStepProgress(response => {
                            if (response.index === 1) {
                                        genres_slide4Debug('onStepProgress slide 4', {
                                            progress: response.progress,
                                            slide4Mode: genres_slide4Mode,
                                            slide4RankMode: genres_slide4RankMode,
                                            hasBubbleChart: !!genres_bubbleChartState,
                                            bubbleEnterPending: genres_bubbleEnterPending,
                                            slide4EnterStarted: genres_slide4EnterStarted
                                        });
                                        syncSlide4StateFromProgress(response.progress);
                                    }

                            // Slide 5: Bar chart progress handling
                            if (response.index === 2) {
                                genres_setSlide5TextProgress(response.progress);
                                genres_updateBarChartMode(response.progress);
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
                            if (direction === 'up' && exitingIndex === 1) {
                                if (currentActiveIndex !== 1) {
                                    activateSlide(0);
                                }
                            }

                            // Exit bubbles when leaving step 4 upward (to slide 3)
                            if (exitingIndex === 1 && direction === 'up') {
                                genres_startBubbleExitAnimation();
                                genres_clearBubbleEnterTimer();
                                genres_slide4EnterStarted = false;
                            }
                            // Also reset when leaving step 4 downward (to slide 5)
                            if (exitingIndex === 1 && direction === 'down') {
                                genres_slide4EnterStarted = false;
                            }
                        });
                }
                
                setupScrollama();
                
                // Helper to determine active slide from scroll
                function determineActiveFromScroll() {
                    if (!scrollThirdContainer.classList.contains('visible')) return;
                    
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
                        if (scroller) scroller.resize();
                        if (scrollThirdContainer.classList.contains('visible')) {
                            determineActiveFromScroll();
                        }
                    }, 200);
                });
                
                window.addEventListener('scroll', () => {
                    if (scrollThirdContainer.classList.contains('visible')) {
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
                    if (!scrollThirdContainer.classList.contains('visible')) {
                        // Even if hidden, pre-activate slide 0
                        activateSlide(0);
                    } else {
                        determineActiveFromScroll();
                    }
                    if (scroller) scroller.resize();
                }, 100);
                
                // Add style for smooth transitions
                const style = document.createElement('style');
                style.textContent = `
                    .narrative-slide-genres {
                        transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    }
                    .scroll-container {
                        transition: opacity 0.7s ease;
                    }
                `;
                document.head.appendChild(style);
                
                console.log("✅ Ready! 5 custom slides:");
                console.log("  Slide 1: Image only");
                console.log("  Slide 2: Text only"); 
                console.log("  Slide 3: Text (LHS) + Image (RHS)");
                console.log("  Slide 4: Genre bubble chart");
                console.log("  Slide 5: Placeholder");
                console.log("To customize: edit each .narrative-slide-genres div with your own HTML/CSS");
            

                // Make sure slide 1 is active immediately
                activateSlide(0);
                scrollThirdContainer.style.opacity = '1';

                // Build slide 4 bubble chart after layout is ready
                genres_buildGenreBubbleChart();

            }

            // ========== SLIDE 4: GENRE BUBBLE CHART (D3) ==========
            function genres_buildGenreBubbleChart() {
                const chartHost = document.getElementById('genreBubbleChart');
                if (!chartHost) {
                    genres_slide4Debug('buildGenreBubbleChart skipped: missing chart host');
                    return;
                }
                if (chartHost.dataset.chartReady === 'true') {
                    genres_slide4Debug('buildGenreBubbleChart skipped: already ready');
                    return;
                }
                if (!window.d3) {
                    console.warn('D3 is not available for the bubble chart.');
                    return;
                }

                // Mark as initialized to avoid duplicate renders
                chartHost.dataset.chartReady = 'true';
                
                    genres_slide4Debug('buildGenreBubbleChart start', {
                    width: chartHost.clientWidth,
                    height: chartHost.clientHeight
                });

                const width = chartHost.clientWidth || 800;
                const height = chartHost.clientHeight || 500;

                const svg = d3.select(chartHost)
                    .append('svg')
                    .attr('class', 'bubble-chart-svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`)
                    .attr('preserveAspectRatio', 'xMidYMid meet');

                // Load CSV and build genre counts
                d3.csv('anson/movies-checkpoint.csv').then(rows => {
                    const nominatedCounts = new Map();
                    const rottenCounts = new Map();
                    const rottenThreshold = 59; // Derived from dataset (Rotten max)

                    rows.forEach(row => {
                        const rawGenres = row.genres || '';
                        const genres = parseGenreList(rawGenres);
                        // Oscar-bait filter: Rotten or rating <= threshold, and has Oscar count
                        const status = (row.tomatometer_status || '').trim().toLowerCase();
                        const rating = parseRating(row.tomatometer_rating);
                        const oscarCount = parseOscarCount(row.oscars);
                        const isRotten = status === 'rotten' || (rating !== null && rating <= rottenThreshold);
                        const hasOscar = oscarCount > 0;

                        if (hasOscar) {
                            genres.forEach(genre => {
                                nominatedCounts.set(genre, (nominatedCounts.get(genre) || 0) + 1);
                            });
                        }

                        if (isRotten && hasOscar) {
                            genres.forEach(genre => {
                                rottenCounts.set(genre, (rottenCounts.get(genre) || 0) + 1);
                            });
                        }
                    });

                    const genreUniverse = new Set([...nominatedCounts.keys(), ...rottenCounts.keys()]);

                    const nodes = Array.from(genreUniverse, genre => ({
                        genre,
                        nominatedCount: nominatedCounts.get(genre) || 0,
                        rottenCount: rottenCounts.get(genre) || 0,
                        activeCount: nominatedCounts.get(genre) || 0
                    }));

                    const maxCount = d3.max(nodes, d => d.nominatedCount) || 1;
                    const radiusScale = d3.scaleSqrt()
                        .domain([0, maxCount])
                        .range([0+10, 149 *0.7+30]);
                    const radiusScale_smaller = d3.scaleSqrt()
                        .domain([0, maxCount])
                        .range([0, 149 *0.7+30]);

                    const colorScale = d3.scaleLinear()
                        .domain([0, maxCount])
                        .range(['#f0af47', '#f5d666']);

                    const centerX = width / 2;
                    const centerY = height / 2;
                    const offscreenPad = Math.max(width, height) * 0.7;

                    nodes.forEach(node => {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = offscreenPad + Math.random() * 240;
                        node.r = radiusScale(node.activeCount);
                        node.x = centerX + Math.cos(angle) * distance;
                        node.y = centerY + Math.sin(angle) * distance;

                        // initialize inner small ball representing rotten ratio
                        const ghostR = radiusScale(node.nominatedCount || 0);
                        const ratio = (node.nominatedCount || 0) > 0 ? (node.rottenCount || 0) / node.nominatedCount : 0;
                        // ball radius proportional to ratio and ghost radius
                        
                        node.ballR = radiusScale_smaller((node.nominatedCount || 0)*ratio);
                        // node.ballR = Math.max(4, Math.round(ghostR * Math.min(0.6, ratio)));
                        // initial position inside the ghost circle (local coords, center at 0,0)
                        const maxOffset = Math.max(0, ghostR - node.ballR - 2);
                        const bx = (Math.random() * 2 - 1) * maxOffset;
                        const by = (Math.random() * 2 - 1) * maxOffset;
                        node.ballX = Math.max(-maxOffset, Math.min(maxOffset, bx));
                        node.ballY = Math.max(-maxOffset, Math.min(maxOffset, by));
                        // small random velocity
                        node.ballVx = (Math.random() * 2 - 1) * 0.4;
                        node.ballVy = (Math.random() * 2 - 1) * 0.4;
                    });

                    const bubbleGroup = svg.append('g').attr('class', 'genre-bubbles');

                    // Helper to create safe clipPath ids
                    function sanitizeId(name) {
                        return (name || '').toString().replace(/[^a-zA-Z0-9_-]/g, '_');
                    }

                    // Create defs + per-node clipPaths so liquid fill/waves are constrained
                    const defs = svg.append('defs');
                    const clip = defs.selectAll('clipPath').data(nodes).enter()
                        .append('clipPath')
                        .attr('id', d => `clip-${sanitizeId(d.genre)}`);

                    clip.append('circle')
                        .attr('class', 'clip-circle')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .attr('r', d => radiusScale(d.nominatedCount || 0));

                    const bubble = bubbleGroup
                        .selectAll('g')
                        .data(nodes)
                        .enter()
                        .append('g')
                        .attr('class', 'bubble-node')
                        .style('opacity', 0);

                    // Outer outline representing bubble boundary (stroke only)
                    bubble.append('circle')
                        .attr('class', 'bubble-outline')
                        .attr('r', d => radiusScale(d.nominatedCount))
                        .attr('fill', 'none')
                        .attr('stroke', 'rgba(240, 175, 71, 0.35)')
                        .attr('stroke-width', 5)
                        .style('opacity', 1);

                    // Invisible hit area keeps hover detection large even when the visible liquid shrinks
                    bubble.append('circle')
                        .attr('class', 'bubble-hit-area')
                        .attr('r', d => radiusScale(d.nominatedCount))
                        .attr('fill', 'rgba(0, 0, 0, 0)')
                        .attr('stroke', 'none')
                        .style('pointer-events', 'all');

                    // Solid filled bubble used in early phases (pre-liquid)
                    bubble.append('circle')
                        .attr('class', 'bubble-fill')
                        .attr('r', d => radiusScale(d.activeCount || d.nominatedCount || 0))
                        .attr('fill', d => colorScale(d.activeCount || d.nominatedCount || 0))
                        .attr('opacity', 1);

                    // Inner liquid core representing the currently active measure (filled)
                    // We use a clipped content group so the fill and wave stay inside the ghost circle
                    const liquidGroup = bubble.append('g').attr('class', 'bubble-liquid-group');

                    const content = liquidGroup.append('g')
                        .attr('class', 'bubble-liquid-content')
                        .attr('clip-path', d => `url(#clip-${sanitizeId(d.genre)})`);

                    // Replace the previous liquid rect with a small moving ball inside each bubble.
                    // Ball radius was initialized on each node as node.ballR.
                    content.append('circle')
                        .attr('class', 'bubble-core-ball')
                        .attr('cx', d => d.ballX)
                        .attr('cy', d => d.ballY)
                        .attr('r', d => d.ballR)
                        .attr('fill', d => colorScale(d.activeCount || d.nominatedCount || 0))
                        .attr('stroke', 'rgba(255, 210, 130, 0.65)')
                        .attr('stroke-width', 1)
                        .style('opacity', 1);

                    // small-ball animation handled on simulation ticks (see simulation 'tick' below)

                    bubble.append('text')
                        .attr('class', 'bubble-label')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '-0.2em')
                        .text(d => d.genre)
                        .style('fill', d => (d.nominatedCount || 0) > 0 && (d.activeCount || 0) === 0 ? '#ffffff' : '#1c1c1c');

                    bubble.append('text')
                        .attr('class', 'bubble-count')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '1.1em')
                        .text(d => d.activeCount)
                        .style('fill', d => (d.nominatedCount || 0) > 0 && (d.activeCount || 0) === 0 ? '#ffffff' : '#1c1c1c');

                    bubble.classed('is-ghost', d => (d.nominatedCount || 0) > 0 && (d.activeCount || 0) === 0);

                    genres_updateBubbleTextSizing();

                    const tooltip = d3.select('#bubbleTooltip');
                    const tooltipHost = document.getElementById('genreBubbleChart');

                    function placeTooltip(event) {
                        if (!tooltipHost) return;
                        const hostRect = tooltipHost.getBoundingClientRect();
                        const tipNode = tooltip.node();
                        const tipWidth = tipNode ? tipNode.offsetWidth : 0;
                        const tipHeight = tipNode ? tipNode.offsetHeight : 0;
                        const pointerX = event.clientX - hostRect.left;
                        const pointerY = event.clientY - hostRect.top;
                        const offset = 12;

                        let left = pointerX - tipWidth - offset;
                        let top = pointerY - tipHeight - offset;

                        if (left < 8) left = pointerX + offset;
                        if (top < 8) top = pointerY + offset;
                        if (left + tipWidth > hostRect.width - 8) left = hostRect.width - tipWidth - 8;
                        if (top + tipHeight > hostRect.height - 8) top = hostRect.height - tipHeight - 8;

                        tooltip
                            .style('left', `${Math.max(8, left)}px`)
                            .style('top', `${Math.max(8, top)}px`);
                    }

                    bubble
                        .on('mouseenter', (event, d) => {
                            if (!genres_bubbleChartState) return;
                            const countRank = getRankForNode(d);
                            const ratioRank = getRatioRankForNode(d);
                            const rotten = d.rottenCount || 0;
                            const nominated = d.nominatedCount || 0;
                            const ratio = nominated > 0 ? (rotten / nominated) : null;
                            const ratioText = ratio === null ? '—' : `${rotten}/${nominated} (${(ratio*100).toFixed(1)}%)`;
                            const totalGenres = genres_bubbleChartState?.nodes?.length || 0;

                            tooltip
                                .style('opacity', 1)
                                .html(`<strong>${d.genre}</strong><br>Count: 📊${d.activeCount} | 🏆 ${countRank}/${totalGenres}<br>Rotten Ratio: 📊 ${ratioText} | 🏆 ${ratioRank}/${totalGenres}`);
                            placeTooltip(event);

                            // Dim other nodes
                            bubble.classed('is-dim', node => node !== d);
                            bubble.select('.bubble-core-ball')
                                .style('opacity', node => node === d ? 1 : 0.08);
                            bubble.select('.bubble-label')
                                .style('opacity', node => node === d ? 1 : 0.08);
                            bubble.select('.bubble-count')
                                .style('opacity', node => node === d ? 1 : 0.08);

                            // On hover: keep original colors, just increase opacity/visibility
                            try {
                                d3.select(event.currentTarget).select('.bubble-outline').attr('stroke-width', 6);
                                d3.select(event.currentTarget).select('.bubble-core-ball').style('filter', 'brightness(1.1)');
                            } catch (e) {
                                // ignore
                            }
                        })
                        .on('mousemove', (event) => {
                            placeTooltip(event);
                        })
                        .on('mouseleave', () => {
                            tooltip.style('opacity', 0);
                            bubble.classed('is-dim', false);

                            // Restore per-node opacity for cores
                            bubble.select('.bubble-core-ball')
                                .style('opacity', node => node.activeCount > 0 ? 1 : 0);
                            bubble.select('.bubble-label')
                                .style('opacity', node => node.activeCount > 0 ? 1 : 0);
                            bubble.select('.bubble-count')
                                .style('opacity', node => node.activeCount > 0 ? 1 : 0);

                            // Restore fills using current rank/progress/colorScale on cores and restore ghost stroke
                            const progress = (genres_bubbleChartState && genres_bubbleChartState.lastProgress) || 0;
                            const colorScaleUse = (genres_bubbleChartState && genres_bubbleChartState.colorScale) || colorScale;
                            const rankMapsUse = (genres_bubbleChartState && genres_bubbleChartState.rankMaps) || buildRankMaps(nodes);
                            bubble.select('.bubble-core-ball').attr('fill', node => getBubbleFill(node, genres_slide4Mode, progress, colorScaleUse, rankMapsUse)).style('filter', 'brightness(1)');
                            bubble.select('.bubble-outline').attr('stroke', 'rgba(240, 175, 71, 0.35)').attr('stroke-width', 5);
                        });

                    const simulation = d3.forceSimulation(nodes)
                        .force('x', d3.forceX(centerX).strength(0.1))
                        .force('y', d3.forceY(centerY).strength(0.12))
                        .force('collide', d3.forceCollide().radius(d => d.r + 4).iterations(2))
                        .force('charge', d3.forceManyBody().strength(10))
                        .on('tick', () => {
                            // update group positions
                            bubble.attr('transform', d => `translate(${d.x}, ${d.y})`);
                            // update inner ball physics per node and DOM
                            bubble.each(function(d) {
                                if (!d) return;
                                const ghostR = radiusScale(d.nominatedCount || 0);
                                const limit = Math.max(0, ghostR - (d.ballR || 4) - 2);

                                // Initialize ball properties if missing: start settled at bottom
                                if (d.ballX === undefined || d.ballY === undefined) {
                                    d.ballX = 0;
                                    d.ballY = limit; // rest at bottom
                                    d.ballVx = d.ballVx || 0;
                                    d.ballVy = d.ballVy || 0;
                                }

                                // Detect group vertical movement (used as a 'push' when group moves up)
                                const prevGroupY = d._prevGroupY !== undefined ? d._prevGroupY : d.y;
                                const groupDelta = prevGroupY - d.y; // positive when group moved up
                                // Apply an impulse proportional to upward group movement
                                if (groupDelta > 0.2) {
                                    // push upward: negative vy (local coords: up is negative)
                                    const pushFactor = 0.18; // tuned impulse strength
                                    d.ballVy += -groupDelta * pushFactor;
                                }

                                // Spring toward bottom (desired resting position = limit)
                                const k = 0.18; // spring stiffness
                                const desiredY = limit;
                                const ay = (desiredY - d.ballY) * k;
                                d.ballVy += ay;

                                // gentle horizontal damping to keep core near center
                                d.ballVx *= 0.92;
                                d.ballVy *= 0.92; // global damping

                                // integrate
                                d.ballX += d.ballVx;
                                d.ballY += d.ballVy;

                                // boundary constraint + bounce when hitting bottom
                                const dist = Math.sqrt(d.ballX * d.ballX + d.ballY * d.ballY);
                                if (dist > limit && dist > 0) {
                                    const nx = d.ballX / dist;
                                    const ny = d.ballY / dist;
                                    d.ballX = nx * limit;
                                    d.ballY = ny * limit;
                                    const dot = d.ballVx * nx + d.ballVy * ny;
                                    d.ballVx = d.ballVx - 2 * dot * nx;
                                    d.ballVy = d.ballVy - 2 * dot * ny;
                                    // stronger damping on collisions
                                    d.ballVx *= 0.75;
                                    d.ballVy *= 0.6;
                                }

                                // If ball is slightly below the resting limit due to integration error, clamp and apply small bounce
                                if (d.ballY > limit) {
                                    d.ballY = limit;
                                    if (Math.abs(d.ballVy) > 0.02) {
                                        d.ballVy = -Math.abs(d.ballVy) * 0.55; // bounce with restitution
                                    } else {
                                        d.ballVy = 0;
                                    }
                                }

                                // Minimal jitter to avoid perfectly static cores (very small)
                                d.ballVx += (Math.random() - 0.5) * 0.002;

                                // update DOM element positions
                                try {
                                    d3.select(this).select('.bubble-core-ball')
                                        .attr('cx', d.ballX)
                                        .attr('cy', d.ballY);
                                } catch (e) {}

                                // store previous group position for next tick
                                d._prevGroupY = d.y;
                            });
                        });

                    // Store chart state for enter/exit animations
                    genres_bubbleChartState = {
                        svg,
                        bubble,
                        nodes,
                        simulation,
                        centerX,
                        centerY,
                        offscreenPad,
                        width,
                        height,
                        radiusScale,
                        colorScale,
                        rankMaps: buildRankMaps(nodes),
                        lastProgress: 0,
                        ghostDisplayProgress: 0
                    };
                    genres_slide4Debug('bubbleChartState ready', {
                        nodeCount: nodes.length,
                        bubbleEnterPending,
                        slide4EnterStarted,
                        currentActiveIndex
                    });
                    // ensure radiusScale is available for applyGenreFilter when first called
                    genres_bubbleChartState.radiusScale = radiusScale;

                    // Start bubbles hidden; entry animation is triggered by scroll step 4
                    bubble.attr('data-ready', 'true');

                    if (genres_bubbleEnterPending && currentActiveIndex === 0) {
                        genres_bubbleEnterPending = false;
                        genres_slide4Debug('bubbleEnterPending resolved after build');
                        genres_scheduleBubbleEnter();
                    }

                    genres_resetBubbleHoverState();
                }).catch(error => {
                    console.error('Failed to load movies-checkpoint.csv:', error);
                });

                // Parse "['Drama', 'Comedy']" into ["Drama", "Comedy"]
                function parseGenreList(raw) {
                    if (!raw || raw === '[]') return [];
                    const trimmed = raw.replace(/^\s*\[/, '').replace(/\]\s*$/, '');
                    if (!trimmed) return [];
                    return trimmed
                        .split(',')
                        .map(item => item.replace(/['"]/g, '').trim())
                        .filter(Boolean);
                }

                function parseRating(raw) {
                    if (raw === null || raw === undefined || raw === '') return null;
                    const value = Number(raw);
                    return Number.isFinite(value) ? value : null;
                }

                // Extract Oscar count from a non-JSON string payload
                function parseOscarCount(raw) {
                    if (!raw) return 0;
                    const text = String(raw);
                    const match = text.match(/['\"]count['\"]\s*:\s*(\d+)/i);
                    return match ? Number(match[1]) : 0;
                }
            }

            // Build horizontal bar chart for Slide 5
                function genres_buildGenreBarChart() {
                const chartHost = document.getElementById('genreBarChart');
                if (!chartHost || chartHost.dataset.chartReady === 'true') return;
                if (!genres_bubbleChartState) {
                    setTimeout(genres_buildGenreBarChart, 500);
                    return;
                }

                chartHost.dataset.chartReady = 'true';

                const width = chartHost.clientWidth || 600;
                const height = chartHost.clientHeight || 500;

                const svg = d3.select(chartHost)
                    .append('svg')
                    .attr('class', 'bar-chart-svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`)
                    .attr('preserveAspectRatio', 'xMidYMid meet');

                // Use bubble chart data (dynamic top 10 from full genre set)
                const { nodes, colorScale, rankMaps } = genres_bubbleChartState;
                
                const allBarData = nodes.map(d => {
                    const nominated = d.nominatedCount || 0;
                    const rotten = d.rottenCount || 0;
                    const ratio = nominated > 0 ? rotten / nominated : 0;
                    return {
                        genre: d.genre,
                        nominated,
                        rotten,
                        ratio,
                        nominatedRank: rankMaps.nominated.get(d.genre) || 999,
                        rottenRank: rankMaps.rotten.get(d.genre) || 999,
                        ratioRank: rankMaps.ratio.get(d.genre) || 999
                    };
                });

                const countOrderAll = [...allBarData]
                    .sort((a, b) => (b.nominated || 0) - (a.nominated || 0))
                    .map(d => d.genre);

                const rottenOrderAll = [...allBarData]
                    .sort((a, b) => (b.rotten || 0) - (a.rotten || 0))
                    .map(d => d.genre);

                const ratioOrderAll = [...allBarData]
                    .sort((a, b) => {
                        const delta = (b.ratio || 0) - (a.ratio || 0);
                        if (Math.abs(delta) > 1e-9) return delta;
                        return (b.nominated || 0) - (a.nominated || 0);
                    })
                    .map(d => d.genre);

                const initialGenres = countOrderAll.slice(0, 10);
                const dataByGenre = new Map(allBarData.map(d => [d.genre, d]));
                const initialData = initialGenres.map(genre => dataByGenre.get(genre)).filter(Boolean);

                const margin = { left: 130, right: 12, top: 20, bottom: 40 };
                const basePlotWidth = Math.max(260, width - margin.left - margin.right);
                const plotWidth = basePlotWidth * 0.97;

                const maxCount = d3.max(allBarData, d => d.nominated) || 1;
                const barScale = d3.scaleLinear()
                    .domain([0, maxCount])
                    .range([0, plotWidth]);

                const yScale = d3.scaleBand()
                    .domain(initialGenres)
                    .range([50, height - 40])
                    .padding(0.3);

                // Add gradient definition for legend
                svg.append('defs').append('linearGradient')
                    .attr('id', 'bar-legend-gradient')
                    .attr('x1', '0%')
                    .attr('x2', '100%')
                    .attr('y1', '0%')
                    .attr('y2', '0%')
                    .selectAll('stop')
                    .data([
                        { offset: '0%', color: '#ffffff' },
                        { offset: '50%', color: '#f5d666' },
                        { offset: '100%', color: '#f0af47' }
                    ])
                    .enter()
                    .append('stop')
                    .attr('offset', d => d.offset)
                    .attr('stop-color', d => d.color);

                // Add legend group
                const legendGroup = svg.append('g')
                    .attr('class', 'bar-legend');

                // Legend gradient bar
                legendGroup.append('rect')
                    .attr('x', margin.left)
                    .attr('y', 5)
                    .attr('width', plotWidth)
                    .attr('height', 24)
                    .attr('fill', 'url(#bar-legend-gradient)')
                    .attr('stroke', '#aabbcc')
                    .attr('stroke-width', 0.5);

                // "Top" label
                legendGroup.append('text')
                    .attr('x', margin.left + 4)
                    .attr('y', 22)
                    .attr('font-size', '10px')
                    .attr('fill', '#000000')
                    .attr('text-anchor', 'start')
                    .text('Top');

                // "Bottom" label
                legendGroup.append('text')
                    .attr('x', margin.left + plotWidth - 4)
                    .attr('y', 22)
                    .attr('font-size', '10px')
                    .attr('fill', '#000000')
                    .attr('text-anchor', 'end')
                    .text('Bottom');

                // Add bars group
                const barGroup = svg.append('g')
                    .attr('class', 'genre-bars')
                    .attr('transform', `translate(${margin.left}, 0)`);

                // Initial bars use nominated-count top 10; later updates can swap in/out by data join
                const barData = initialData;

                // Ghost bars (rotten nominees)
                barGroup.selectAll('.bar-ghost')
                    .data(barData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar-ghost')
                    .attr('x', 0)
                    .attr('y', d => yScale(d.genre))
                    .attr('width', d => barScale(d.nominated))
                    .attr('height', yScale.bandwidth())
                    .attr('fill', 'rgba(240, 175, 71, 0.15)')
                    .attr('stroke', 'rgba(240, 175, 71, 0.35)')
                    .attr('stroke-width', 1)
                    .style('opacity', 0);

                // Core bars (current measure)
                barGroup.selectAll('.bar-core')
                    .data(barData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar-core')
                    .attr('x', 0)
                    .attr('y', d => yScale(d.genre))
                    .attr('width', d => barScale(d.nominated))
                    .attr('height', yScale.bandwidth())
                    .attr('fill', d => {
                        const rank = d.nominatedRank;
                        if (rank <= 5) {
                            const intensity = 1;
                            const base = d3.color(colorScale(d.nominated));
                            const r = Math.round((base?.r ?? 240) + (255 - (base?.r ?? 240)) * intensity * 0.6);
                            const g = Math.round((base?.g ?? 175) + (255 - (base?.g ?? 175)) * intensity * 0.6);
                            const b = Math.round((base?.b ?? 71) + (255 - (base?.b ?? 71)) * intensity * 0.6);
                            return `rgb(${r}, ${g}, ${b})`;
                        }
                        return colorScale(d.nominated);
                    })
                    .attr('stroke', 'rgba(255, 210, 130, 0.65)')
                    .attr('stroke-width', 1);

                // Genre labels on left
                barGroup.selectAll('.bar-label')
                    .data(barData)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-label')
                    .attr('x', -10)
                    .attr('y', d => yScale(d.genre) + yScale.bandwidth() / 2)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'end')
                    .attr('font-size', '12px')
                    .attr('fill', '#ddc319')
                    .text(d => d.genre);

                // Count labels on right
                barGroup.selectAll('.bar-count')
                    .data(barData)
                    .enter()
                    .append('text')
                    .attr('class', 'bar-count')
                    .attr('x', d => barScale(d.nominated) + 8)
                    .attr('y', d => yScale(d.genre) + yScale.bandwidth() / 2)
                    .attr('dy', '0.35em')
                    .attr('font-size', '11px')
                    .attr('fill', '#ffb347')
                    .text(d => d.nominated);

                // Store bar state
                genres_bubbleChartState.barChart = {
                    svg,
                    barGroup,
                    barData,
                    allBarData,
                    dataByGenre,
                    barScale,
                    plotWidth,
                    yScale,
                    baseYScale: yScale,
                    countOrderAll,
                    rottenOrderAll,
                    ratioOrderAll,
                    visibleLimit: 10,
                    rankMaps
                };
            }
            
            // Update bubble sizes for Oscar-nominated vs Oscar-nominated-Rotten dataset
            function genres_applyGenreFilter(mode) {
                if (!genres_bubbleChartState) return;
                const { nodes, bubble, simulation, centerX, centerY } = genres_bubbleChartState;
                const selectedCount = node => mode === 'nominated-rotten' ? node.rottenCount : node.nominatedCount;
                const maxCount = d3.max(nodes, selectedCount) || 1;
                const scale = d3.scaleSqrt().domain([0, maxCount]).range([26, 149]);
                const colorScale = d3.scaleLinear()
                    .domain([0, maxCount])
                    .range(['#f0af47', '#f5d666']);
                const tvMovieNode = nodes.find(entry => entry.genre === 'TV Movie');
                const minFilteredRadius = tvMovieNode ? Math.max(0, scale(tvMovieNode.nominatedCount) - 5) : 0;
                const zeroRadius = Math.max(4, scale(1) * 0.25);

                // Calculate ghost (original nominated) and core (active) radii
                nodes.forEach(node => {
                    node.activeCount = selectedCount(node);
                    // ghost radius always reflects nominatedCount using the baseline radiusScale
                    node._ghostR = (genres_bubbleChartState && genres_bubbleChartState.radiusScale) ? genres_bubbleChartState.radiusScale(node.nominatedCount || 0) : radiusScale(node.nominatedCount || 0);

                    // core radius is proportional to the ghost radius: core = ghost * (active / nominated)
                    if ((node.nominatedCount || 0) > 0) {
                        if (node.rottenCount > 0) {
                            const ratio = node.rottenCount / node.nominatedCount;
                            node._coreR = Math.max(zeroRadius, node._ghostR * ratio);
                        } else {
                            // activeCount == 0: show only ghost ring (no filled core)
                            node._coreR = 0;
                        }
                    } else {
                        node._coreR = 0;
                    }

                    // collision radius uses the larger of the two so items don't overlap
                    node.r = Math.max(node._ghostR || 0, node._coreR || 0);
                });

                bubble.classed('is-ghost', d => (d.nominatedCount || 0) > 0 && (d.activeCount || 0) === 0);

                genres_bubbleChartState.colorScale = colorScale;
                genres_bubbleChartState.rankMaps = buildRankMaps(nodes);

                const progress = genres_bubbleChartState.lastProgress;

                // Update ghost ring (original nominations) and core (active measure)
                // Update clip path to match ghost radius so liquid is constrained
                if (genres_bubbleChartState && genres_bubbleChartState.svg) {
                    genres_bubbleChartState.svg.selectAll('.clip-circle')
                        .interrupt()
                        .transition()
                        .duration(600)
                        .attr('r', d => d._ghostR);
                }

                bubble.select('.bubble-outline')
                    .interrupt()
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .attr('r', d => d._ghostR)
                    .style('opacity', mode === 'nominated-rotten' ? 0.12 : 1)
                    .attr('stroke-width', 5);

                bubble.select('.bubble-hit-area')
                    .interrupt()
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .attr('r', d => d._ghostR)
                    .style('opacity', 0);

                bubble.select('.bubble-liquid-base')
                    .interrupt()
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .attr('x', d => -d._ghostR)
                    .attr('y', d => {
                        const ratio = (d.nominatedCount || 0) > 0 ? (d.rottenCount || 0) / d.nominatedCount : 0;
                        return d._ghostR - (2 * d._ghostR * ratio);
                    })
                    .attr('width', d => d._ghostR * 2)
                    .attr('height', d => {
                        const ratio = (d.nominatedCount || 0) > 0 ? (d.rottenCount || 0) / d.nominatedCount : 0;
                        return 2 * d._ghostR * ratio;
                    })
                    .attr('rx', 0)
                    .style('opacity', d => d.activeCount > 0 ? 1 : 0.12)
                    .attr('fill', d => getBubbleFill(d, mode, progress, colorScale, genres_bubbleChartState.rankMaps));

                bubble.select('.bubble-count')
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .text(d => {
                        // At progress >= 0.6, show rotten ratio (percentage); before that, show count
                        if (progress >= 0.6) {
                            const ratio = (d.nominatedCount || 0) > 0 ? (d.rottenCount || 0) / d.nominatedCount : 0;
                            return `${(ratio * 100).toFixed(0)}%`;
                        }
                        return d.activeCount;
                    })
                    .style('opacity', d => d.activeCount > 0 ? 1 : 0);

                bubble.select('.bubble-label')
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .style('opacity', d => d.activeCount > 0 ? 1 : 0);

                genres_updateBubbleTextSizing();

                simulation
                    .force('collide', d3.forceCollide().radius(d => (d.r || 0) + 4).iterations(2))
                    .force('x', d3.forceX(centerX).strength(0.1))
                    .force('y', d3.forceY(centerY).strength(0.1))
                    .alpha(0.6)
                    .restart();

                updateRankColors(progress);
            }

            function genres_updateBubbleTextSizing() {
                if (!genres_bubbleChartState) return;
                const { bubble } = genres_bubbleChartState;
                bubble.select('.bubble-label')
                    .style('font-size', d => `${Math.max(10, Math.min(24, d.r * 0.18))}px`)
                    .style('line-height', 1);
                bubble.select('.bubble-count')
                    .style('font-size', d => `${Math.max(11, Math.min(26, d.r * 0.2))}px`)
                    .style('line-height', 1);
            }

            function genres_setSlide4Mode(mode) {
                genres_slide4Mode = mode;
                genres_applyGenreFilter(mode);
                genres_resetBubbleHoverState();
                const slide4 = document.querySelector('.narrative-slide-genres[data-slide="1"]');
                if (slide4) {
                    slide4.classList.toggle('mode-rotten', mode === 'nominated-rotten');
                }
            }

            function genres_getSlide4RankMap(rankMode, rankMaps) {
                if (!rankMaps) return new Map();
                return rankMode === 'ratio'
                    ? rankMaps.ratio
                    : (genres_slide4Mode === 'nominated-rotten' ? rankMaps.rotten : rankMaps.nominated);
            }

            function genres_getSlide4RankIntensity(progress) {
                // Compute intensity for count/ratio tinting according to explicit windows:
                // count: ramp 0.2->0.3 to 1.0, fully 0.3->0.5, remains 1 until ratio crossfade
                // ratio: ramp 0.6->0.7 to 1.0
                if (typeof progress !== 'number' || !isFinite(progress)) return 0;
                // We'll return a value [0,1] representing how strong the active rank tint should be
                if (progress < 0.2) return 0;
                if (progress >= 0.2 && progress < 0.3) {
                    return (progress - 0.2) / 0.1; // 0->1
                }
                if (progress >= 0.3 && progress < 0.6) {
                    return 1; // count tint fully applied until ratio crossfade starts at 0.6
                }
                if (progress >= 0.6 && progress < 0.7) {
                    // during 0.6-0.7 we prefer ratio tint; return progressive intensity for ratio
                    return (progress - 0.6) / 0.1; // 0->1 for ratio
                }
                return progress >= 0.7 ? 1 : 0;
            }

            function genres_getSlide4TextColor(node, map, intensity) {
                // // Debug: Check if map is valid
                // if (!map || map.size === 0) {
                //     console.warn('Rank map not ready, using default color');
                //     return '#1c1c1c';
                // }
                // console.log(node.genre);
                const baseText = d3.rgb(28, 28, 28);
                const highlightText = d3.rgb(255, 0, 4);
                const rank = map.get(node.genre) || 999;
                

                // if (node.genre === 'Drama' || node.genre === 'Romance' || node.genre === 'Comedy'|| node.genre === 'Family' ||node.genre === 'Thriller' ) return '#FF0000';
                if (genres_slide4Mode === 'nominated-rotten' && (node.nominatedCount || 0) > 0 && rank > 5) {
                    return '#ffffff';
                }

                if (rank > 5 || intensity <= 0) {
                    return '#1c1c1c';
                }

                if (rank <= 5) {
                    return '#FF0000';
                }


                const r = Math.round(baseText.r + (highlightText.r - baseText.r) * intensity);
                const g = Math.round(baseText.g + (highlightText.g - baseText.g) * intensity);
                const b = Math.round(baseText.b + (highlightText.b - baseText.b) * intensity);
                return `rgb(${r}, ${g}, ${b})`;
            }

            function genres_getSlide4GhostColor(node, map) {
                const rank = map.get(node.genre) || 999;
                const baseColor = getBubbleBaseColor(node, genres_bubbleChartState?.colorScale);
                const strokeMix = rank <= 5 ? 0.88 : 0.8;
                const fillMix = rank <= 5 ? 0.94 : 0.9;
                const ghostTint = '#fff8e8';

                return {
                    stroke: d3.interpolateRgb(baseColor, ghostTint)(strokeMix),
                    fill: d3.interpolateRgb(baseColor, ghostTint)(fillMix)
                };
            }

            function getBubbleBaseColor(node, colorScale) {
                if (!colorScale) {
                    return '#f0af47';
                }

                const value = node.nominatedCount || node.activeCount || 0;
                return d3.color(colorScale(value))?.formatRgb() || '#f0af47';
            }

            function blendTowardWhite(color, amount) {
                const base = d3.color(color);
                if (!base) return '#ffffff';
                return d3.interpolateRgb(base.formatRgb(), '#ffffff')(amount);
            }

            function getBubbleFillForMap(node, mode, progress, colorScale, rankMaps, mapOverride) {
                const map = mapOverride || genres_getSlide4RankMap(genres_slide4RankMode, rankMaps);
                const rank = map.get(node.genre) || 999;

                if ((node.nominatedCount || 0) > 0 && (node.activeCount || 0) === 0 && rank > 5) {
                    return '#ffffff';
                }

                const base = d3.color(colorScale(node.activeCount));
                const intensity = genres_getSlide4RankIntensity(progress);

                if (rank > 5 || intensity <= 0) {
                    return base?.formatRgb() || '#f0af47';
                }

                const strength = rank <= 2 ? 0.6 : 0.35;
                const t = Math.min(1, intensity * strength);
                const r = Math.round((base?.r ?? 240) + (255 - (base?.r ?? 240)) * t);
                const g = Math.round((base?.g ?? 175) + (255 - (base?.g ?? 175)) * t);
                const b = Math.round((base?.b ?? 71) + (255 - (base?.b ?? 71)) * t);
                return `rgb(${r}, ${g}, ${b})`;
            }

            function genres_getSlide4GhostProgress(progress) {
                if (typeof progress !== 'number' || !isFinite(progress)) return 0;
                if (progress <= 0.5) return 0;
                return Math.min(1, (progress - 0.5) / 0.5);
            }

            function updateSlide4GhostDisplayProgress(progress) {
                if (!genres_bubbleChartState) return 0;

                const target = genres_getSlide4GhostProgress(progress);
                const current = typeof genres_bubbleChartState.ghostDisplayProgress === 'number'
                    ? genres_bubbleChartState.ghostDisplayProgress
                    : 0;
                const next = current + (target - current) * 0.05;

                genres_bubbleChartState.ghostDisplayProgress = next;
                return next;
            }

            function genres_getSlide4LiquidRatio(node, progress) {
                return 0.01;
            }

                function buildRankMaps(nodes) {
                const mapNominated = new Map();
                const mapRotten = new Map();
                const mapRatio = new Map();

                const nominatedSorted = [...nodes].sort((a, b) => b.nominatedCount - a.nominatedCount);
                nominatedSorted.forEach((node, idx) => mapNominated.set(node.genre, idx + 1));

                const rottenSorted = [...nodes].sort((a, b) => b.rottenCount - a.rottenCount);
                rottenSorted.forEach((node, idx) => mapRotten.set(node.genre, idx + 1));

                const ratioSorted = [...nodes].sort((a, b) => {
                    const aRatio = (a.nominatedCount || 0) > 0 ? (a.rottenCount || 0) / a.nominatedCount : 0;
                    const bRatio = (b.nominatedCount || 0) > 0 ? (b.rottenCount || 0) / b.nominatedCount : 0;
                    return bRatio - aRatio;
                });
                ratioSorted.forEach((node, idx) => mapRatio.set(node.genre, idx + 1));

                return { nominated: mapNominated, rotten: mapRotten, ratio: mapRatio };
            }

            function getRankForNode(node) {
                if (!genres_bubbleChartState || !genres_bubbleChartState.rankMaps) return '-';
                const map = genres_slide4Mode === 'nominated-rotten' ? genres_bubbleChartState.rankMaps.rotten : genres_bubbleChartState.rankMaps.nominated;
                return map.get(node.genre) || '-';
            }

            function getRatioRankForNode(node) {
                if (!genres_bubbleChartState || !genres_bubbleChartState.rankMaps) return '-';
                const map = genres_bubbleChartState.rankMaps.ratio;
                return map.get(node.genre) || '-';
            }

            function updateRankColors(progress) {
                if (!genres_bubbleChartState) return;
                genres_bubbleChartState.lastProgress = progress;
                const { bubble, colorScale, rankMaps } = genres_bubbleChartState;
                // Determine count and ratio maps
                const countMap = rankMaps ? rankMaps.nominated : new Map();
                const ratioMap = rankMaps ? rankMaps.ratio : new Map();

                // Compute dual intensities for crossfading: count and ratio
                let countIntensity = 0;
                let ratioIntensity = 0;
                if (progress >= 0.2 && progress < 0.6) {
                    // count is active; intensity from getSlide4RankIntensity
                    countIntensity = Math.min(1, genres_getSlide4RankIntensity(progress));
                }
                if (progress >= 0.6) {
                    // ratio crossfade starts at 0.6
                    ratioIntensity = Math.min(1, genres_getSlide4RankIntensity(progress));
                    // reduce countIntensity during crossfade
                    countIntensity = Math.max(0, 1 - ratioIntensity);
                }

                const effectiveMap = ratioIntensity > 0 ? ratioMap : countMap;
                const effectiveIntensity = Math.max(countIntensity, ratioIntensity);

                // Update solid fill (pre-liquid) for early phases
                bubble.select('.bubble-fill')
                    .attr('r', d => (genres_bubbleChartState.radiusScale ? genres_bubbleChartState.radiusScale(d.activeCount || d.nominatedCount || 0) : d.r))
                    .attr('fill', d => {
                        // blend base + count/ratio tint
                        const base = d3.color(colorScale(d.activeCount));
                        const countColor = (countIntensity > 0) ? getBubbleFillForMap(d, 'nominated', progress, colorScale, rankMaps, countMap) : base.formatRgb();
                        if (ratioIntensity > 0) {
                            const ratioColor = getBubbleFillForMap(d, 'nominated-rotten', progress, colorScale, rankMaps, ratioMap);
                            // crossfade between countColor and ratioColor
                            return d3.interpolateRgb(countColor, ratioColor)(ratioIntensity);
                        }
                        return countColor;
                    });

                // Update liquid fill (used when liquid content visible)
                bubble.select('.bubble-liquid-base')
                    .attr('y', d => {
                        const ghostR = d._ghostR || (genres_bubbleChartState.radiusScale ? genres_bubbleChartState.radiusScale(d.nominatedCount || 0) : d.r || 0);
                        const ratio = genres_getSlide4LiquidRatio(d, progress);
                        return ghostR - (2 * ghostR * ratio);
                    })
                    .attr('height', d => {
                        const ghostR = d._ghostR || (genres_bubbleChartState.radiusScale ? genres_bubbleChartState.radiusScale(d.nominatedCount || 0) : d.r || 0);
                        const ratio = genres_getSlide4LiquidRatio(d, progress);
                        return 2 * ghostR * ratio;
                    })
                    .attr('fill', d => {
                        const countColor = getBubbleFillForMap(d, 'nominated', progress, colorScale, rankMaps, countMap);
                        const ratioColor = getBubbleFillForMap(d, 'nominated-rotten', progress, colorScale, rankMaps, ratioMap);
                        // crossfade according to ratioIntensity
                        return d3.interpolateRgb(countColor, ratioColor)(ratioIntensity);
                    });

                // Outline stroke (ghost/outline color)
                bubble.select('.bubble-outline')
                    .attr('stroke', d => genres_getSlide4GhostColor(d, effectiveMap, colorScale).stroke)
                    .attr('stroke-width', 5)
                    .style('opacity', d => genres_slide4Mode === 'nominated-rotten' ? 0.45 : 1);

                bubble.select('.bubble-label')
                    .style('fill', d => genres_getSlide4TextColor(d, effectiveMap, effectiveIntensity));

                bubble.select('.bubble-count')
                    .text(d => {
                        // At progress >= 0.6, show rotten ratio (percentage); before that, show count
                        if (progress >= 0.6) {
                            const ratio = (d.nominatedCount || 0) > 0 ? (d.rottenCount || 0) / d.nominatedCount : 0;
                            return `${(ratio * 100).toFixed(0)}%`;
                        }
                        return d.activeCount;
                    })
                    .style('fill', d => genres_getSlide4TextColor(d, effectiveMap, effectiveIntensity));
            }

            function genres_setSlide4TextProgress(progress) {
                const slide4 = document.querySelector('.narrative-slide-genres[data-slide="1"]');
                if (!slide4) return;
                const steps = slide4.querySelectorAll('.genres_slide4-step');
                const visibleSteps = new Set();

                // Custom scrollytelling sequence:
                // 0: 1a (intro to bubbles)
                // 0.2-0.4: 1a+1b (color explanation)
                // 0.4-0.5: 2a (rotten nominees intro)
                // 0.5-0.7: 2a+2b (ghost bubbles explanation)
                // 0.7-0.8: 3a (ratio ranking)
                // 0.8-0.9: 3a+3b+3c (full conclusion)

                if (progress < 0.2) {
                    visibleSteps.add('t1');
                    visibleSteps.add('1a');
                } else if (progress < 0.4) {
                    visibleSteps.add('t1');
                    visibleSteps.add('1a');
                    visibleSteps.add('1b');
                } else if (progress < 0.5) {
                    visibleSteps.add('t2');
                    visibleSteps.add('2a');
                } else if (progress < 0.6) {
                    visibleSteps.add('t2');
                    visibleSteps.add('2a');
                    visibleSteps.add('2b');
                } else if (progress < 0.7) {
                    visibleSteps.add('t2');
                    visibleSteps.add('2a');
                    visibleSteps.add('2b');
                    visibleSteps.add('3a');
                } else if (progress < 0.8) {
                    visibleSteps.add('t3');
                    visibleSteps.add('3a');
                    visibleSteps.add('3b');
                } else {
                    visibleSteps.add('t3');
                    visibleSteps.add('3a');
                    visibleSteps.add('3b');
                    visibleSteps.add('3c');
                }

                steps.forEach(step => {
                    const key = step.getAttribute('data-step');
                    step.classList.toggle('is-visible', visibleSteps.has(key));
                });
            }

            function syncSlide4StateFromProgress(progress) {
                if (typeof progress !== 'number' || !isFinite(progress)) return;
                updateSlide4GhostDisplayProgress(progress);

                // Determine canonical stage flags according to requested sequence:
                // phase A: progress < 0.2  -> filled yellow bubbles
                // phase B: 0.2-0.3 -> top5 by count tint ramps in
                // phase C: 0.3-0.5 -> count tint fully applied
                // phase D: >=0.5 -> convert to ghost outline + fluid core
                // phase E: 0.6-0.7 -> switch tint basis from count -> rotten ratio (crossfade)

                // Save progress early so applyGenreFilter and other functions can use it
                if (genres_bubbleChartState) genres_bubbleChartState.lastProgress = progress;

                const nextFilterMode = progress < 0.5 ? 'nominated' : 'nominated-rotten';
                const nextRankMode = progress < 0.6 ? 'count' : 'ratio';
                const liquidEnabled = progress >= 0.5;

                // Apply filter mode (this updates radii etc.)
                if (genres_slide4Mode !== nextFilterMode) {
                    // genres_applyGenreFilter will be called from genres_setSlide4Mode
                    genres_setSlide4Mode(nextFilterMode);
                } else {
                    // still re-run genres_applyGenreFilter to ensure radii reflect progress when needed
                    genres_applyGenreFilter(genres_slide4Mode);
                }

                // Rank mode change handled but we also want the color mapping to be driven
                if (genres_slide4RankMode !== nextRankMode) {
                    genres_setSlide4RankMode(nextRankMode);
                }

                // Update text steps
                genres_setSlide4TextProgress(progress);

                // Update visuals: fills, outlines, and show/hide fluid vs solid fill
                updateRankColors(progress);

                // Show or hide bubble-fill vs bubble-liquid based on liquidEnabled
                if (genres_bubbleChartState) {
                    const { bubble } = genres_bubbleChartState;
                    if (liquidEnabled) {
                        // hide solid fill, show liquid content
                        bubble.select('.bubble-fill')
                            .interrupt()
                            .transition()
                            .duration(450)
                            .style('opacity', 0);

                        bubble.select('.bubble-liquid-content')
                            .interrupt()
                            .transition()
                            .duration(450)
                            .style('opacity', 1);
                    } else {
                        bubble.select('.bubble-fill')
                            .interrupt()
                            .transition()
                            .duration(450)
                            .style('opacity', 1);

                        bubble.select('.bubble-liquid-content')
                            .interrupt()
                            .transition()
                            .duration(450)
                            .style('opacity', 0);
                    }
                }
            }

            function genres_setSlide5TextProgress(progress) {
                const slide5 = document.querySelector('.narrative-slide-genres[data-slide="2"]');
                if (!slide5) return;
                const steps = slide5.querySelectorAll('.genres_slide5-step');
                const visibleSteps = new Set();

                // Slide 5 scrollytelling:
                // 0-0.5: Show ranking by count
                // 0.5-0.8: Show ghost bars (rotten nominees)
                // 0.8-1.0: Reorder by ratio ranking

                if (progress < 0.3) {
                    visibleSteps.add('1');
                } else if (progress < 0.6) {
                    visibleSteps.add('2');
                } else if (progress < 0.8){
                    visibleSteps.add('3a');
                } else {
                    visibleSteps.add('3a');
                    visibleSteps.add('3b');
                }

                steps.forEach(step => {
                    const key = step.getAttribute('data-step');
                    step.classList.toggle('is-visible', visibleSteps.has(key));
                });
            }

            function genres_updateBarChartMode(progress) {
                if (!genres_bubbleChartState || !genres_bubbleChartState.barChart) return;
                const { barChart, colorScale } = genres_bubbleChartState;
                const {
                    barGroup,
                    allBarData,
                    dataByGenre,
                    baseYScale,
                    countOrderAll,
                    rottenOrderAll,
                    ratioOrderAll,
                    visibleLimit
                } = barChart;

                // Three phases:
                // Phase 1 (0-0.3): Show nominated count, normal colors, bar-ghost hidden
                // Phase 2 (0.3-0.6): Bar becomes "ghosted" (faded), bar-ghost shows rotten count (filled portion)
                // Phase 3 (0.6+): Bar stretches to 100%, bar-ghost shows ratio-based filled portion

                let phase = 'phase1';
                
                if (progress < 0.3) {
                    phase = 'phase1';
                } else if (progress < 0.6) {
                    phase = 'phase2';
                } else {
                    phase = 'phase3';
                }

                // Reorder timing rules:
                // <0.4: nominated count top10 order
                // 0.4-0.7: rotten count top10 order
                // >=0.7: rotten ratio top10 order
                const orderAll = progress < 0.4
                    ? countOrderAll
                    : (progress < 0.7 ? rottenOrderAll : ratioOrderAll);
                const activeGenres = orderAll.slice(0, visibleLimit || 10);
                const activeData = activeGenres
                    .map(genre => dataByGenre.get(genre))
                    .filter(Boolean);

                const yScale = d3.scaleBand()
                    .domain(activeGenres)
                    .range(baseYScale.range())
                    .padding(baseYScale.padding());

                // Recalculate scales based on phase
                let coreScale, ghostScale;
                const chartWidth = barChart.plotWidth || 300;

                if (phase === 'phase1' || phase === 'phase2') {
                    const maxNominated = d3.max(allBarData, d => d.nominated) || 1;
                    coreScale = d3.scaleLinear()
                        .domain([0, maxNominated])
                        .range([0, chartWidth]);
                    ghostScale = coreScale;
                } else {
                    // Phase 3: both bars stretched to 100% (ratio view)
                    coreScale = d3.scaleLinear()
                        .domain([0, 1])
                        .range([0, chartWidth]);
                    ghostScale = coreScale;
                }

                barChart.currentPhase = phase;
                barChart.coreScale = coreScale;
                barChart.ghostScale = ghostScale;
                barChart.currentYScale = yScale;

                const offscreenY = (baseYScale.range()[1] || 0) + yScale.bandwidth() + 18;
                const duration = 600;

                function getBarColor(d) {
                    const rank = d.nominatedRank;
                    if (rank <= 5) {
                        const intensity = 1;
                        const base = d3.color(colorScale(d.nominated));
                        const r = Math.round((base?.r ?? 240) + (255 - (base?.r ?? 240)) * intensity * 0.6);
                        const g = Math.round((base?.g ?? 175) + (255 - (base?.g ?? 175)) * intensity * 0.6);
                        const b = Math.round((base?.b ?? 71) + (255 - (base?.b ?? 71)) * intensity * 0.6);
                        return `rgb(${r}, ${g}, ${b})`;
                    }
                    return colorScale(d.nominated);
                }

                // Update bar-core (nominated count or 100% in phase 3)
                const coreSelection = barGroup.selectAll('.bar-core')
                    .data(activeData, d => d.genre);

                coreSelection.exit()
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicIn)
                    .attr('y', offscreenY)
                    .style('opacity', 0)
                    .remove();

                const coreEnter = coreSelection.enter()
                    .append('rect')
                    .attr('class', 'bar-core')
                    .attr('x', 0)
                    .attr('y', offscreenY)
                    .attr('height', yScale.bandwidth())
                    .attr('width', 0)
                    .attr('stroke', 'rgba(255, 210, 130, 0.65)')
                    .attr('stroke-width', 1)
                    .style('opacity', 0);

                coreEnter.merge(coreSelection)
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicOut)
                    .attr('y', d => yScale(d.genre))
                    .attr('height', yScale.bandwidth())
                    .attr('width', d => {
                        if (phase === 'phase1' || phase === 'phase2') {
                            return coreScale(d.nominated);
                        } else {
                            return coreScale(1);
                        }
                    })
                    .style('opacity', d => {
                        if (phase === 'phase1') return 1;
                        return 0.3;
                    })
                    .attr('fill', d => getBarColor(d));

                // Update bar-ghost (rotten count in phase 2, or ratio-based in phase 3)
                const ghostSelection = barGroup.selectAll('.bar-ghost')
                    .data(activeData, d => d.genre);

                ghostSelection.exit()
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicIn)
                    .attr('y', offscreenY)
                    .style('opacity', 0)
                    .remove();

                const ghostEnter = ghostSelection.enter()
                    .append('rect')
                    .attr('class', 'bar-ghost')
                    .attr('x', 0)
                    .attr('y', offscreenY)
                    .attr('height', yScale.bandwidth())
                    .attr('width', 0)
                    .attr('fill', 'rgba(240, 175, 71, 0.15)')
                    .attr('stroke', 'rgba(240, 175, 71, 0.35)')
                    .attr('stroke-width', 1)
                    .style('opacity', 0);

                ghostEnter.merge(ghostSelection)
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicOut)
                    .attr('y', d => yScale(d.genre))
                    .attr('height', yScale.bandwidth())
                    .attr('width', d => {
                        if (phase === 'phase1') {
                            return 0;
                        } else if (phase === 'phase2') {
                            return ghostScale(d.rotten);
                        } else {
                            const ratio = (d.nominated || 0) > 0 ? (d.rotten || 0) / d.nominated : 0;
                            return ghostScale(ratio);
                        }
                    })
                    .style('opacity', d => {
                        if (phase === 'phase1') return 0;
                        return 0.8;
                    })
                    .attr('fill', d => getBarColor(d));

                // Update labels
                const labelSelection = barGroup.selectAll('.bar-label')
                    .data(activeData, d => d.genre);

                labelSelection.exit()
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicIn)
                    .attr('y', offscreenY)
                    .style('opacity', 0)
                    .remove();

                const labelEnter = labelSelection.enter()
                    .append('text')
                    .attr('class', 'bar-label')
                    .attr('x', -10)
                    .attr('y', offscreenY)
                    .attr('dy', '0.35em')
                    .attr('text-anchor', 'end')
                    .attr('font-size', '12px')
                    .attr('fill', '#ddc319')
                    .style('opacity', 0)
                    .text(d => d.genre);

                labelEnter.merge(labelSelection)
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicOut)
                    .attr('y', d => yScale(d.genre) + yScale.bandwidth() / 2);
                labelEnter.merge(labelSelection)
                    .text(d => d.genre)
                    .style('opacity', 1);

                // Update count text
                const countSelection = barGroup.selectAll('.bar-count')
                    .data(activeData, d => d.genre);

                countSelection.exit()
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicIn)
                    .attr('y', offscreenY)
                    .style('opacity', 0)
                    .remove();

                const countEnter = countSelection.enter()
                    .append('text')
                    .attr('class', 'bar-count')
                    .attr('x', 0)
                    .attr('y', offscreenY)
                    .attr('dy', '0.35em')
                    .attr('font-size', '11px')
                    .attr('fill', '#ffb347')
                    .style('opacity', 0);

                countEnter.merge(countSelection)
                    .text(d => {
                        if (phase === 'phase1') {
                            return d.nominated;
                        } else if (phase === 'phase2') {
                            return d.rotten;
                        }
                        const ratio = (d.nominated || 0) > 0 ? (d.rotten || 0) / d.nominated : 0;
                        return `${(ratio * 100).toFixed(0)}%`;
                    })
                    .interrupt()
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicOut)
                    .attr('y', d => yScale(d.genre) + yScale.bandwidth() / 2)
                    .attr('x', d => {
                        if (phase === 'phase1' || phase === 'phase2') {
                            return (phase === 'phase1' ? coreScale(d.nominated) : ghostScale(d.rotten)) + 8;
                        }
                        const ratio = (d.nominated || 0) > 0 ? (d.rotten || 0) / d.nominated : 0;
                        return ghostScale(ratio) + 8;
                    })
                    .style('opacity', 1);
            }

            function genres_animateRankModeTransition(previousRankMode, nextRankMode, progress) {
                if (!genres_bubbleChartState) return;
                const { bubble, colorScale, rankMaps } = genres_bubbleChartState;
                const previousMap = genres_getSlide4RankMap(previousRankMode, rankMaps);
                const nextMap = genres_getSlide4RankMap(nextRankMode, rankMaps);
                const duration = 450;

                bubble.select('.bubble-liquid-base')
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .attrTween('fill', function(d) {
                        const startColor = getBubbleFillForMap(d, genres_slide4Mode, progress, colorScale, rankMaps, previousMap);
                        const endColor = getBubbleFillForMap(d, genres_slide4Mode, progress, colorScale, rankMaps, nextMap);
                        const interpolate = d3.interpolateRgb(startColor, endColor);
                        return t => interpolate(t);
                    });

                bubble.select('.bubble-outline')
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .attrTween('stroke', function(d) {
                        const startColor = genres_getSlide4GhostColor(d, previousMap).stroke;
                        const endColor = genres_getSlide4GhostColor(d, nextMap).stroke;
                        const interpolate = d3.interpolateRgb(startColor, endColor);
                        return t => interpolate(t);
                    });

                bubble.select('.bubble-label')
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .styleTween('fill', function(d) {
                        const startColor = genres_getSlide4TextColor(d, previousMap, genres_getSlide4RankIntensity(progress));
                        const endColor = genres_getSlide4TextColor(d, nextMap, genres_getSlide4RankIntensity(progress));
                        const interpolate = d3.interpolateRgb(startColor, endColor);
                        return t => interpolate(t);
                    });

                bubble.select('.bubble-count')
                    .transition()
                    .duration(duration)
                    .ease(d3.easeCubicInOut)
                    .styleTween('fill', function(d) {
                        const startColor = genres_getSlide4TextColor(d, previousMap, genres_getSlide4RankIntensity(progress));
                        const endColor = genres_getSlide4TextColor(d, nextMap, genres_getSlide4RankIntensity(progress));
                        const interpolate = d3.interpolateRgb(startColor, endColor);
                        return t => interpolate(t);
                    });
            }

            function getBubbleFill(node, mode, progress, colorScale, rankMaps) {
                const map = genres_getSlide4RankMap(genres_slide4RankMode, rankMaps);
                return getBubbleFillForMap(node, mode, progress, colorScale, rankMaps, map);
            }

            function genres_resetBubbleHoverState() {
                if (!genres_bubbleChartState) return;
                const tooltip = d3.select('#bubbleTooltip');
                tooltip.style('opacity', 0);
                genres_bubbleChartState.bubble.classed('is-dim', false);
                genres_logDimState('reset');
            }

            function genres_logDimState(label) {
                if (!genres_bubbleChartState) return;
                const dimCount = genres_bubbleChartState.bubble.filter('.is-dim').size();
                const total = genres_bubbleChartState.bubble.size();
            }

            // Delay the entry animation so it does not overlap with slide crossfade
            function genres_scheduleBubbleEnter() {
                if (!genres_bubbleChartState) {
                    genres_bubbleEnterPending = true;
                    genres_slide4Debug('scheduleBubbleEnter deferred: no bubbleChartState yet');
                    return;
                }
                genres_clearBubbleEnterTimer();
                genres_slide4Debug('scheduleBubbleEnter -> startBubbleEnterAnimation');
                genres_startBubbleEnterAnimation();
            }

            function genres_clearBubbleEnterTimer() {
                if (genres_bubbleEnterTimer) {
                    clearTimeout(genres_bubbleEnterTimer);
                    genres_bubbleEnterTimer = null;
                }
            }

            // Animate bubbles from outside toward the center
            function genres_startBubbleEnterAnimation() {
                if (!genres_bubbleChartState) return;
                const { nodes, bubble, simulation, centerX, centerY, offscreenPad } = genres_bubbleChartState;
                genres_slide4Debug('startBubbleEnterAnimation', {
                    nodeCount: nodes.length,
                    centerX,
                    centerY,
                    offscreenPad
                });

                nodes.forEach(node => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = offscreenPad + 200 + Math.random() * 240;
                    node.x = centerX + Math.cos(angle) * distance;
                    node.y = centerY + Math.sin(angle) * distance;
                });

                bubble.interrupt().style('opacity', 1);
                genres_slide4Debug('bubble opacity set to 1, restarting simulation');

                simulation
                    .force('radial', null)
                    .force('x', d3.forceX(centerX).strength(0.14))
                    .force('y', d3.forceY(centerY).strength(0.14))
                    .alpha(1)
                    .alphaTarget(0.08)
                    .restart();
            }

            // Animate bubbles drifting back out of the frame
            function genres_startBubbleExitAnimation() {
                if (!genres_bubbleChartState) return;
                const { bubble, simulation, centerX, centerY, offscreenPad } = genres_bubbleChartState;
                const exitRadius = offscreenPad + 240;

                simulation
                    .force('radial', d3.forceRadial(exitRadius, centerX, centerY).strength(0.08))
                    .force('x', d3.forceX(centerX).strength(0.01))
                    .force('y', d3.forceY(centerY).strength(0.01))
                    .alpha(0.9)
                    .alphaTarget(0.12)
                    .restart();

                bubble.transition()
                    .duration(1000)
                    .ease(d3.easeCubicIn)
                    .style('opacity', 0.15);
            }
        })();