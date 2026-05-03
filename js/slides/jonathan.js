// ============================================================
// SIMPLE SCROLL-BASED SLIDE ACTIVATION (No scrollama)
// ============================================================
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFourthNarrative);
    } else {
        initFourthNarrative();
    }
    
    function initFourthNarrative() {
        console.log("🎬 Fourth Narrative - Simple Scroll Handler");
        
        // DOM elements
        const scrollFourthContainer = document.getElementById('scrollFourthContainer');
        const slides = document.querySelectorAll('.narrative-slide-jon');
        const triggerSteps = document.querySelectorAll('#FourthTriggerContainer .trigger-step');
        
        const totalSlides = slides.length;
        console.log(`Total slides: ${totalSlides}`);
        console.log(`Trigger steps found: ${triggerSteps.length}`);
        
        const slideNames = ["Budget Tree Map", "Director Bubble Chart", "Director Bar Chart"];
        let currentActiveIndex = 0;
        
        // Make container visible
        if (scrollFourthContainer) {
            scrollFourthContainer.classList.add('visible');
            scrollFourthContainer.style.opacity = '1';
            scrollFourthContainer.style.visibility = 'visible';
            console.log("✅ Container set to visible");
        }
        
        // Function to activate a slide
        function activateSlide(index) {
            if (index === currentActiveIndex) return;
            if (index < 0 || index >= totalSlides) return;
            
            console.log(`📱 Activating slide ${index}: ${slideNames[index]}`);
            
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                    slide.style.opacity = '1';
                    slide.style.display = 'block';
                    console.log(`  ✅ Showing slide ${i}`);
                } else {
                    slide.classList.remove('active');
                    slide.style.opacity = '0';
                    slide.style.display = 'none';
                }
            });
            
            currentActiveIndex = index;
            
            // Trigger resize for D3 charts
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
        
        // Initialize slides
        slides.forEach((slide, i) => {
            slide.style.transition = 'opacity 0.5s ease-in-out';
            if (i === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.display = 'block';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.display = 'none';
            }
        });
        
        // Check which slide should be active based on scroll position
        function checkActiveSlide() {
            const viewportMid = window.innerHeight * 0.55;
            let activeIndex = 0;
            
            triggerSteps.forEach((step, idx) => {
                const rect = step.getBoundingClientRect();
                const triggerTop = rect.top;
                const triggerBottom = rect.bottom;
                
                // If the trigger's midpoint is near the viewport center
                if (triggerTop <= viewportMid && triggerBottom >= viewportMid) {
                    activeIndex = idx;
                }
                // Also check if we're past the trigger but not yet at the next one
                else if (triggerTop <= viewportMid && idx === triggerSteps.length - 1) {
                    activeIndex = idx;
                }
            });
            
            if (activeIndex !== currentActiveIndex) {
                activateSlide(activeIndex);
            }
        }
        
        // Throttled scroll handler for better performance
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkActiveSlide();
                    ticking = false;
                });
                ticking = true;
            }
        }
        
        // Add scroll listener
        window.addEventListener('scroll', onScroll);
        
        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                checkActiveSlide();
            }, 200);
        });
        
        // Initial check
        setTimeout(() => {
            checkActiveSlide();
            console.log("🎉 Fourth narrative ready!");
            
            // Log trigger positions
            triggerSteps.forEach((step, i) => {
                const rect = step.getBoundingClientRect();
                console.log(`  Trigger ${i}: height ${rect.height}px`);
            });
        }, 100);
        
        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .narrative-slide-jon {
                transition: opacity 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                position: relative;
                width: 100%;
                min-height: 500px;
            }
            .narrative-slide-jon.active {
                display: block !important;
                opacity: 1 !important;
            }
            .scroll-container-jon.visible {
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            /* Fix layouts for slides */
            .split-text-jon, .split-image-jon {
                display: flex;
                width: 100%;
            }
            
            .stacked-layout-jon {
                display: flex;
                gap: 20px;
            }
            
            .stacked-image-jon, .stacked-text-jon {
                flex: 1;
            }
            
            /* Ensure D3 containers are visible */
            #director-bubble, #director-barchart-jon, #tree-diagram {
                width: 100%;
                min-height: 400px;
            }
        `;
        document.head.appendChild(style);
        
        console.log("✅ Ready! Scroll to see slides 0, 1, and 2");
    }
})();