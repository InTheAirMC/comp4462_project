// import { initSearchSlide, searchMovies } from './slides/search.js';
// import { renderMoviePosters } from './slides/posters.js';
import { initLineGraph } from './slides/linegraph.js';
import { renderWordCloud, rescaleWordCloud, filterToLeftColumn, restoreFromLeftColumn, categoryFrequencyData1, categoryFrequencyData2 } from './slides/wordcloud.js';


// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing narratives");
    initFirstNarrative();
    initSecondNarrative();
});

// ========== FIRST NARRATIVE ==========
function initFirstNarrative() {
    console.log("🎬 First narrative - starting");
    
    const slides = document.querySelectorAll('.narrative-slide');
    const triggerSteps = document.querySelectorAll('.trigger-step');
    const totalSlides = slides.length;
    let currentIndex = 0;
    
    function activateSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        currentIndex = index;
        console.log(`First narrative - Slide ${index + 1} activated`);
        
        if (index === 1) {
        }
        
        if (index === 2) {
            setTimeout(() => {
                if (typeof d3 !== 'undefined') {
                    initLineGraph();
                }
            }, 100);
        }
    }
    
    const scroller = scrollama();
    
    scroller
        .setup({
            step: '.trigger-step',
            offset: 0.55,
            threshold: 0.2,
            debug: false
        })
        .onStepEnter(response => {
            const idx = response.index;
            if (idx >= 0 && idx < totalSlides && idx !== currentIndex) {
                activateSlide(idx);
            }
        });
    
    activateSlide(0);
    console.log("✅ First narrative ready!");
}

// ========== SECOND NARRATIVE ==========
function initSecondNarrative() {
    console.log("🎬 Second narrative - starting");
    
    const secondContainer = document.getElementById('secondScrollContainer');
    if (!secondContainer) {
        console.log('Second narrative container not found');
        return;
    }
    
    const slides = document.querySelectorAll('#secondFixedNarrative .second-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    let currentData = 'data1';
    
    // Get elements
    const slide2Textbox = document.getElementById('secondSlide2Textbox');
    const slide3Textbox = document.getElementById('secondSlide3Textbox');
    const slide4Textbox = document.getElementById('secondSlide4Textbox');
    const wordcloudWrapper = document.getElementById('wordcloudWrapper');
    const wordcloudContainer = document.querySelector('.second-wordcloud-wrapper');
    
    console.log(`Found ${totalSlides} second slides`);
    
    // DEFINE activateSecondSlide BEFORE using it in Scrollama
    function activateSecondSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        console.log(`Activating second slide ${index + 1}`);
        
        // Update slide visibility
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active-second');
            } else {
                slide.classList.remove('active-second');
            }
        });
        
        currentIndex = index;
        
        // SLIDE 1: Hide word cloud
        if (index === 0) {
            if (slide2Textbox) slide2Textbox.style.display = 'none';
            if (slide3Textbox) slide3Textbox.style.display = 'none';
            if (slide4Textbox) slide4Textbox.style.display = 'none';
            if (wordcloudContainer) wordcloudContainer.style.display = 'none';
        }
        
        // SLIDE 2: Show word cloud with data1
        if (index === 1) {
            if (wordcloudContainer) wordcloudContainer.style.display = 'flex';
            if (slide2Textbox) slide2Textbox.style.display = 'flex';
            if (slide3Textbox) slide3Textbox.style.display = 'none';
            if (slide4Textbox) slide4Textbox.style.display = 'none';
            
            if (currentData === 'data2') {
                console.log('Going from slide 3 to slide 2 - rescale back to data1');
                setTimeout(() => {
                    rescaleWordCloud('wordcloudWrapper', categoryFrequencyData1, 800);
                    currentData = 'data1';
                }, 100);
            } 
            else if (currentData === 'filtered') {
                console.log('Going from slide 4 to slide 2 - restore and rescale to data1');
                setTimeout(() => {
                    restoreFromLeftColumn('wordcloudWrapper', categoryFrequencyData1, 400);
                    setTimeout(() => {
                        rescaleWordCloud('wordcloudWrapper', categoryFrequencyData1, 400);
                        currentData = 'data1';
                    }, 500);
                }, 100);
            }
            else if (currentData === 'data1' && wordcloudWrapper && wordcloudWrapper.innerHTML === '') {
                setTimeout(() => {
                    renderWordCloud('wordcloudWrapper', categoryFrequencyData1, 0.9);
                    currentData = 'data1';
                }, 100);
            }
        }
        
        
        // SLIDE 3: Rescale to data2
        if (index === 2) {
            if (wordcloudContainer) wordcloudContainer.style.display = 'flex';
            if (slide2Textbox) slide2Textbox.style.display = 'none';
            if (slide3Textbox) slide3Textbox.style.display = 'flex';
            if (slide4Textbox) slide4Textbox.style.display = 'none';
            
            if (currentData === 'data1') {
                console.log('Going from slide 2 to slide 3 - rescale to data2');
                setTimeout(() => {
                    rescaleWordCloud('wordcloudWrapper', categoryFrequencyData2, 800);
                    currentData = 'data2';
                }, 100);
            } 
            else if (currentData === 'filtered') {
                console.log('Going from slide 4 to slide 3 - restore then rescale to data2');
                setTimeout(() => {
                    restoreFromLeftColumn('wordcloudWrapper', categoryFrequencyData2, 400);
                    setTimeout(() => {
                        rescaleWordCloud('wordcloudWrapper', categoryFrequencyData2, 400);
                        currentData = 'data2';
                    }, 500);
                }, 100);
            }
        }
        
        // SLIDE 4: Filter to left column
        if (index === 3) {
            console.log('ACTIVATING SLIDE 4');
            
            if (slide2Textbox) slide2Textbox.style.display = 'none';
            if (slide3Textbox) slide3Textbox.style.display = 'none';
            if (slide4Textbox) slide4Textbox.style.display = 'flex';
            
            if (wordcloudContainer) {
                wordcloudContainer.style.display = 'flex';
            }
            
            const targetWords = ['SHORT FILM', 'DANCE DIRECTION', 'MAKEUP AND HAIRSTYLING', 'VISUAL EFFECTS'];
            setTimeout(() => {
                if (typeof filterToLeftColumn === 'function') {
                    filterToLeftColumn('wordcloudWrapper', targetWords, 1000);
                    currentData = 'filtered';
                }
            }, 100);
        }



        // SLIDE 5: Conclusion slide (just text, hide everything else)
        if (index === 4) {
            console.log('ACTIVATING SLIDE 5 - Conclusion');
            
            // Hide all textboxes
            if (slide2Textbox) slide2Textbox.style.display = 'none';
            if (slide3Textbox) slide3Textbox.style.display = 'none';
            if (slide4Textbox) slide4Textbox.style.display = 'none';
            
            // Hide word cloud
            if (wordcloudContainer) wordcloudContainer.style.display = 'none';
            
            // No data manipulation needed - just show the conclusion slide
        }
    }
    // Set initial states
    if (slide2Textbox) slide2Textbox.style.display = 'none';
    if (slide3Textbox) slide3Textbox.style.display = 'none';
    if (slide4Textbox) slide4Textbox.style.display = 'none';
    if (wordcloudContainer) wordcloudContainer.style.display = 'none';
    
    // Activate first slide
    activateSecondSlide(0);
    
    // Scrollama setup for second narrative
    // Scrollama setup for second narrative
    const secondScroller = scrollama();

    secondScroller
        .setup({
            step: '#secondTriggerContainer .second-trigger-step',
            offset: 0.4,
            threshold: 0.1,
            debug: false
        })
        .onStepEnter(response => {
            const stepIndex = response.index;
            console.log(`Second narrative step entered: ${stepIndex}`);
            activateSecondSlide(stepIndex);
        })
        .onStepExit(response => {
            const exitingStep = response.index;
            const scrollDirection = response.direction;
            console.log(`Second narrative step exited: ${exitingStep}, direction: ${scrollDirection}`);
            
            // Handle backward scrolling
            if (scrollDirection === 'up' && exitingStep === 1) {
                console.log('Scrolling up from slide 2 to slide 1');
                activateSecondSlide(0);
            }
            if (scrollDirection === 'up' && exitingStep === 2) {
                console.log('Scrolling up from slide 3 to slide 2');
                activateSecondSlide(1);
            }
            if (scrollDirection === 'up' && exitingStep === 3) {
                console.log('Scrolling up from slide 4 to slide 3');
                // First restore word positions with a delay to ensure slide is active
                setTimeout(() => {
                    if (typeof restoreFromLeftColumn === 'function') {
                        restoreFromLeftColumn('wordcloudWrapper', categoryFrequencyData2, 800);
                    }
                }, 50);
                // Then activate slide 3 after animation
                setTimeout(() => {
                    activateSecondSlide(2);
                }, 850);
            }
            if (scrollDirection === 'up' && exitingStep === 4) {
                console.log('Scrolling up from slide 5 to slide 4');
                activateSecondSlide(3);
            }
        });
    
    console.log("✅ Second narrative ready!");
}