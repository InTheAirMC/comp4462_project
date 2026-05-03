// js/slides/wordcloud.js

const cloudWidth = 800;
const cloudHeight = 200;


const categoryFrequencyData1 = {
    'MUSIC': 1,
    'WRITING': 0.8278,
    'BEST PICTURE': 0.7025,
    'CINEMATOGRAPHY': 0.6843,
    'ART DIRECTION': 0.6747,
    'DIRECTING': 0.6206,
    'COSTUME DESIGN': 0.6100,
    'ACTOR IN A LEADING ROLE': 0.6078,
    'FILM EDITING': 0.5911,
    'ACTRESS IN A SUPPORTING ROLE': 0.5817,
    'ACTRESS IN A LEADING ROLE': 0.5780,
    'ACTOR IN A SUPPORTING ROLE': 0.5737,
    'SOUND MIXING': 0.5396,
    'VISUAL EFFECTS': 0.4512,
    'SOUND EDITING': 0.3881,
    'SOUND RECORDING': 0.3726,
    'MAKEUP HAIRSTYLING': 0.3672,
    'DOCUMENTARY': 0.3641,
    'INTERNATIONAL FEATURE FILM': 0.3625,
    'SHORT FILM': 0.3526,
    'ANIMATED FEATURE FILM': 0.3251,
    'SPECIAL ACHIEVEMENT AWARD': 0.3100,
    'ASSISTANT DIRECTOR': 0.3100,
    'DANCE DIRECTION': 0.3038,
};

const categoryFrequencyData2 = {
    'SHORT FILM': 1,
    'DANCE DIRECTION': 0.9,
    'MAKEUP HAIRSTYLING': 0.8329,
    'VISUAL EFFECTS': 0.76,
    'INTERNATIONAL FEATURE FILM': 0.6222,
    'SOUND EDITING': 0.6183,
    'MUSIC': 0.6090,
    'SOUND MIXING': 0.6062,
    'COSTUME DESIGN': 0.5994,
    'ART DIRECTION': 0.5983,
    'CINEMATOGRAPHY': 0.5452,
    'SPECIAL ACHIEVEMENT AWARD': 0.5276,
    'DOCUMENTARY': 0.5206,
    'ACTOR IN A SUPPORTING ROLE': 0.4811,
    'DIRECTING': 0.4753,
    'FILM EDITING': 0.4752,
    'ASSISTANT DIRECTOR': 0.4680,
    'BEST PICTURE': 0.4598,
    'ACTRESS IN A LEADING ROLE': 0.4581,
    'ACTOR IN A LEADING ROLE': 0.4305,
    'SOUND RECORDING': 0.7000,
    'ACTRESS IN A SUPPORTING ROLE': 0.4280,
    'WRITING': 0.4252,
    'ANIMATED FEATURE FILM': 0.3
};

// Helper function to blend colors based on value (0 to 1)
function getColorByValue(value) {
    // value close to 1 = #801B1D (dark red)
    // value close to 0.3 = #FFFFFF (white)
    
    // Parse the target colors
    const color1 = { r: 128, g: 27, b: 29 };  // #801B1D
    const color2 = { r: 255, g: 255, b: 255 }; // #FFFFFF
    
    // Normalize value range: original range [0.3, 1] mapped to [0, 1]
    let t;
    if (value <= 0.0) {
        t = 0;
    } else if (value >= 1) {
        t = 1;
    } else {
        t = (value - 0.2) / (1 - 0.2); // Linear interpolation factor
    }
    
    // Interpolate between color2 (white) and color1 (dark red)
    const red = Math.floor(color2.r + (color1.r - color2.r) * t);
    const green = Math.floor(color2.g + (color1.g - color2.g) * t);
    const blue = Math.floor(color2.b + (color1.b - color2.b) * t);
    
    return `rgb(${red}, ${green}, ${blue})`;
}

// Function to add color intensity bar below word cloud
export function addColorIntensityBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    // Remove existing bar if present
    const existingBar = container.querySelector('.color-intensity-bar');
    if (existingBar) {
        existingBar.remove();
    }
    
    // Create bar container
    const barContainer = document.createElement('div');
    barContainer.className = 'color-intensity-bar';
    barContainer.style.width = '100%';
    barContainer.style.opacity = '0';
    barContainer.style.transition = 'opacity 0.8s ease';
    barContainer.style.marginTop = '30px';
    barContainer.style.marginBottom = '20px';
    barContainer.style.padding = '0 20px';
    
    // Create gradient bar
    const gradientBar = document.createElement('div');
    gradientBar.style.width = '20%';
    barContainer.style.margin = '0 auto';
    barContainer.style.display = 'flex';
    barContainer.style.flexDirection = 'column';
    barContainer.style.alignItems = 'center';
    barContainer.style.justifyContent = 'center';
    gradientBar.style.height = '30px';
    gradientBar.style.borderRadius = '15px';
    gradientBar.style.background = 'linear-gradient(to right, #FFFFFF, #FFB3B3, #FF6B6B, #D43F3F, #801B1D)';
    gradientBar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    gradientBar.style.marginBottom = '10px';
    
    // Create labels container
    const labelsContainer = document.createElement('div');
    labelsContainer.style.display = 'flex';
    labelsContainer.style.justifyContent = 'space-between';
    labelsContainer.style.width = '20%';
    labelsContainer.style.fontSize = '14px';
    labelsContainer.style.fontFamily = "'Inter', sans-serif";
    labelsContainer.style.fontWeight = '500';
    
    // Left label (Oscar worthy)
    const leftLabel = document.createElement('span');
    leftLabel.textContent = '← Oscar worthy';
    leftLabel.style.color = '#FFFFFF';
    leftLabel.style.letterSpacing = '0.5px';
    
    // Right label (Oscar baity)
    const rightLabel = document.createElement('span');
    rightLabel.textContent = 'Oscar baity →';
    rightLabel.style.color = '#d22e31';
    rightLabel.style.letterSpacing = '0.5px';
    
    labelsContainer.appendChild(leftLabel);
    labelsContainer.appendChild(rightLabel);
    
    barContainer.appendChild(gradientBar);
    barContainer.appendChild(labelsContainer);
    
    // Append to container
    container.appendChild(barContainer);
    
    setTimeout(() => {
        barContainer.style.opacity = '1';
    }, 10);
    console.log('Color intensity bar added to', containerId);
}

// Remove color intensity bar
export function removeColorIntensityBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const existingBar = container.querySelector('.color-intensity-bar');
    if (existingBar) {
        existingBar.remove();
        console.log('Color intensity bar removed from', containerId);
    }
}

// Recolor existing word cloud with a color palette (no rescaling)
export function recolorWordCloud(containerId, colorPalette) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    const textElements = svg.querySelectorAll('text');
    textElements.forEach((element, idx) => {
        const newColor = colorPalette[idx % colorPalette.length];
        element.setAttribute('fill', newColor);
    });
    
    console.log(`Recolored word cloud with palette`);
}

// Store current word elements for smooth transitions
let currentWordElements = [];
let originalWordData = {};







export function filterToLeftColumn(containerId, targetWords, duration = 1000) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Check if statues already exist
    if (window.statuesCreated) {
        console.log('Statues already exist, skipping');
        return;
    }
    
    // Hide gradient bar
    const gradientBar = container.querySelector('.color-intensity-bar');
    if (gradientBar) {
        gradientBar.style.opacity = '0';
    }
    
    // Hide the word cloud container
    const wordcloudWrapper = document.querySelector('.second-wordcloud-wrapper');
    if (wordcloudWrapper) {
        wordcloudWrapper.style.display = 'none';
    }
    
    const categoryRatios = {
        'SHORT FILM': 4.1,
        'DANCE DIRECTION': 3.3,
        'MAKEUP HAIRSTYLING': 3.1,
        'VISUAL EFFECTS': 2.9
    };
    
    // Color values for category titles
    const categoryColorValues = {
        'SHORT FILM': 1,
        'DANCE DIRECTION': 0.9,
        'MAKEUP HAIRSTYLING': 0.8329,
        'VISUAL EFFECTS': 0.76
    };
    
    const targetWordList = ['SHORT FILM', 'DANCE DIRECTION', 'MAKEUP HAIRSTYLING', 'VISUAL EFFECTS'];
    
    // Helper function for red overlay
    function addRedOverlay(statueWrapper, percentage) {
        const overlayDiv = document.createElement('div');
        overlayDiv.style.position = 'absolute';
        overlayDiv.style.top = '0';
        overlayDiv.style.left = '0';
        overlayDiv.style.width = '100%';
        overlayDiv.style.height = '100%';
        overlayDiv.style.background = '#cc0000';
        overlayDiv.style.clipPath = `polygon(0% 0%, ${percentage}% 0%, ${percentage}% 100%, 0% 100%)`;
        overlayDiv.style.borderRadius = '3px';
        overlayDiv.style.pointerEvents = 'none';
        overlayDiv.style.opacity = '0.85';
        statueWrapper.appendChild(overlayDiv);
    }
    
    // Color the category titles
    targetWordList.forEach((category) => {
        const titleElement = document.querySelector(`.category-title[data-category="${category}"]`);
        if (titleElement) {
            const colorValue = categoryColorValues[category];
            const titleColor = getColorByValue(colorValue);
            titleElement.style.color = titleColor;
        }
    });
    
    // Store all statue wrappers for gradual appearance
    const allStatueWrappers = [];
    
    // Create all statues first (hidden), store references
    targetWordList.forEach((category, categoryIdx) => {
        const statueRow = document.getElementById(`statueRow${categoryIdx}`);
        if (!statueRow) return;
        
        statueRow.innerHTML = '';
        
        const statuesContainer = document.createElement('div');
        statuesContainer.className = 'statues-container';
        
        const totalStatues = 10;
        const redCountFull = Math.floor(categoryRatios[category]);
        const redFraction = categoryRatios[category] - redCountFull;
        
        // Create statues but keep them hidden initially
        for (let i = 0; i < totalStatues; i++) {
            const statueWrapper = document.createElement('div');
            statueWrapper.className = 'statue-wrapper';
            statueWrapper.style.opacity = '0';  // Start hidden
            statueWrapper.style.transition = 'opacity 0.3s ease';
            
            const statueImg = document.createElement('img');
            statueImg.src = 'images/oscarstatue.png';
            statueImg.alt = 'Oscar Statue';
            
            statueWrapper.appendChild(statueImg);
            
            if (i < redCountFull) {
                addRedOverlay(statueWrapper, 100);
            } else if (i === redCountFull && redFraction > 0) {
                addRedOverlay(statueWrapper, redFraction * 100);
            }
            
            statuesContainer.appendChild(statueWrapper);
            
            // Store with metadata
            allStatueWrappers.push({
                wrapper: statueWrapper,
                categoryIdx: categoryIdx,
                statueIdx: i
            });
        }
        
        statueRow.appendChild(statuesContainer);
        
        // Add label (hidden initially)
        const label = document.createElement('div');
        label.className = 'statue-label';
        label.textContent = `${categoryRatios[category]}/10 Oscar Bait ratio`;
        label.style.opacity = '0';
        label.style.transition = 'opacity 0.5s ease';
        statueRow.appendChild(label);
        
        // Store label reference
        if (!window.statueLabels) window.statueLabels = [];
        window.statueLabels.push(label);
    });
    
    // Show statues one by one with staggered timing
    let currentIndex = 0;
    const totalStatues = allStatueWrappers.length;
    
    function showNextStatue() {
        if (currentIndex < totalStatues) {
            const item = allStatueWrappers[currentIndex];
            item.wrapper.style.opacity = '1';
            currentIndex++;
            
            // Schedule next statue
            setTimeout(showNextStatue, 80);  // 80ms between each statue
        } else {
            // All statues shown, now show labels gradually
            let labelIndex = 0;
            
            function showNextLabel() {
                if (window.statueLabels && labelIndex < window.statueLabels.length) {
                    window.statueLabels[labelIndex].style.opacity = '1';
                    labelIndex++;
                    setTimeout(showNextLabel, 200);
                } else {
                    // Finally, show the red gradient bar
                    setTimeout(() => {
                        if (gradientBar) {
                            gradientBar.style.transition = 'opacity 1s ease';
                            gradientBar.style.opacity = '1';
                            console.log('Gradient bar appeared');
                        }
                    }, 300);
                }
            }
            
            // Start showing labels
            showNextLabel();
        }
    }
    
    // Start the animation after a short delay
    setTimeout(showNextStatue, 200);
    
    window.statuesCreated = true;
    console.log(`Starting gradual appearance of ${totalStatues} statues`);
}


export function restoreFromLeftColumn(containerId, originalData, duration = 1000) {
    // Show gradient bar
    const gradientBar = document.querySelector('.color-intensity-bar');
    if (gradientBar) {
        gradientBar.style.transition = 'opacity 0.6s ease';
        gradientBar.style.opacity = '1';
    }
    
    // Show word cloud container
    const wordcloudWrapper = document.querySelector('.second-wordcloud-wrapper');
    if (wordcloudWrapper) {
        wordcloudWrapper.style.display = 'flex';
    }
    
    // Clear statues from all rows
    for (let i = 0; i < 4; i++) {
        const statueRow = document.getElementById(`statueRow${i}`);
        if (statueRow) {
            statueRow.innerHTML = '';
        }
    }
    
    // Reset labels array
    window.statueLabels = [];
    window.statuesCreated = false;
    
    console.log('Restored from slide 4');
}

// Function to calculate text width
function getTextWidth(text, fontSize) {
    let charWidth = fontSize * 0.75;
    if (text.length > 10) charWidth = fontSize * 0.65;
    if (text.length > 15) charWidth = fontSize * 0.6;
    return text.length * charWidth;
}

// Function to calculate new position for a word based on its size
function calculateWordPosition(word, allWords, placedWords, centerX, centerY, cloudWidth, cloudHeight) {
    const wordWidth = getTextWidth(word.text, word.size);
    const wordHeight = word.size * 1.15;
    
    let radius = 0;
    let angle = 0;
    let attempts = 0;
    const maxAttempts = 800;
    
    while (attempts < maxAttempts) {
        let x, y;
        
        if (attempts === 0) {
            x = centerX;
            y = centerY;
        } else {
            angle += 0.28;
            radius += 5;
            x = centerX + Math.cos(angle) * radius;
            y = centerY + Math.sin(angle) * radius;
        }
        
        x = Math.max(wordWidth / 2 + 10, Math.min(cloudWidth - wordWidth / 2 - 10, x));
        y = Math.max(wordHeight / 2 + 10, Math.min(cloudHeight - wordHeight / 2 - 10, y));
        
        const bounds = {
            x: x - wordWidth / 2,
            y: y - wordHeight / 2,
            width: wordWidth,
            height: wordHeight
        };
        
        let overlap = false;
        for (let p of placedWords) {
            if (bounds.x < p.x + p.width + 3 &&
                bounds.x + bounds.width + 3 > p.x &&
                bounds.y < p.y + p.height + 3 &&
                bounds.y + bounds.height + 3 > p.y) {
                overlap = true;
                break;
            }
        }
        
        if (!overlap) {
            return { x, y, wordWidth, wordHeight, bounds };
        }
        attempts++;
    }
    
    // Fallback position
    const fallbackX = Math.random() * (cloudWidth - wordWidth - 20) + wordWidth / 2 + 10;
    const fallbackY = Math.random() * (cloudHeight - wordHeight - 20) + wordHeight / 2 + 10;
    return {
        x: fallbackX,
        y: fallbackY,
        wordWidth: wordWidth,
        wordHeight: wordHeight,
        bounds: {
            x: fallbackX - wordWidth / 2,
            y: fallbackY - wordHeight / 2,
            width: wordWidth,
            height: wordHeight
        }
    };
}

// Render initial word cloud (Slide 2)
export function renderWordCloud(containerId, data, opacityLevel = 0.9) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return null;
    }
    
    container.innerHTML = '';
    currentWordElements = [];
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${cloudWidth} ${cloudHeight}`);
    svg.style.display = 'block';
    container.appendChild(svg);
    
    const slide2Counts = {
        'SHORT FILM': 103,
        'DANCE DIRECTION': 9,
        'MAKEUP HAIRSTYLING': 123,
        'VISUAL EFFECTS': 224,
        'MUSIC': 1126,
        'WRITING': 843,
        'SPECIAL ACHIEVEMENT AWARD': 24,
        'ACTRESS IN A LEADING ROLE': 412,
        'ART DIRECTION': 579,
        'CINEMATOGRAPHY': 596,
        'COSTUME DESIGN': 461,
        'DIRECTING': 477,
        'ACTOR IN A LEADING ROLE': 459,
        'ACTRESS IN A SUPPORTING ROLE': 418,
        'ACTOR IN A SUPPORTING ROLE': 403,
        'FILM EDITING': 433,
        'BEST PICTURE': 628,
        'ASSISTANT DIRECTOR': 24,
        'DOCUMENTARY': 117,
        'SOUND MIXING': 342,
        'SOUND EDITING': 144,
        'INTERNATIONAL FEATURE FILM': 115,
        'SPECIAL AWARD': 12,
        'SOUND RECORDING': 128,
        'HONORARY AWARD': 5,
        'SHORT SUBJECT': 4,
        'ANIMATED FEATURE FILM': 60
    };
    
    const words = Object.entries(data).map(([text, value]) => ({
        text: text,
        size: Math.max(5, Math.min(40, Math.pow(value, 2) * 40)),
        value: value
    }));
    
    const sortedWords = [...words].sort((a, b) => b.size - a.size);
    // const slide2ColorPalette = ['#ccb68e', '#ae9f7c', '#88785d', '#5b5b5b', '#393939'];
    const slide2ColorPalette = ['#ccb68e', '#ae9f7c', '#88785d'];
    const placedWords = [];
    const centerX = cloudWidth / 2;
    const centerY = cloudHeight / 2;
    
    // Store all text elements for hover effect
    const allTextElements = [];
    
    // Create tooltip element
    let tooltip = document.querySelector('.wordcloud-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'wordcloud-tooltip hidden';
        document.body.appendChild(tooltip);
    }
    
    function showTooltip(event, text, count) {
        tooltip.innerHTML = `Category <strong>${text}</strong><br>Awarded to <strong>${count}</strong> Oscar Movies`;
        tooltip.style.left = (event.clientX + 15) + 'px';
        tooltip.style.top = (event.clientY + 15) + 'px';
        tooltip.classList.remove('hidden');
    }
    
    function hideTooltip() {
        tooltip.classList.add('hidden');
    }
    
    function handleMouseEnter(event, wordText, count) {
        // Dim all other text elements to 30% opacity
        allTextElements.forEach(el => {
            if (el !== event.target) {
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0.1';
            }
        });
        showTooltip(event, wordText, count);
    }
    
    function handleMouseLeave(event) {
        // Restore all text elements to full opacity
        allTextElements.forEach(el => {
            el.style.opacity = '1';
        });
        hideTooltip();
    }
    
    sortedWords.forEach((word, idx) => {
        const { x, y, wordWidth, wordHeight, bounds } = calculateWordPosition(
            word, sortedWords, placedWords, centerX, centerY, cloudWidth, cloudHeight
        );
        
        placedWords.push(bounds);
        
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('text-anchor', 'middle');
        textElement.setAttribute('dominant-baseline', 'middle');
        textElement.setAttribute('font-size', `${word.size}px`);
        textElement.setAttribute('font-family', 'Inter, sans-serif');
        textElement.setAttribute('font-weight', 'bold');
        textElement.setAttribute('fill', slide2ColorPalette[idx % slide2ColorPalette.length]);
        textElement.setAttribute('opacity', opacityLevel);
        textElement.textContent = word.text;
        
        const count = slide2Counts[word.text] || Math.floor(word.value * 100);
        textElement.style.cursor = 'pointer';
        
        // Add hover events
        textElement.addEventListener('mouseenter', (e) => handleMouseEnter(e, word.text, count));
        textElement.addEventListener('mouseleave', handleMouseLeave);
        textElement.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });
        
        svg.appendChild(textElement);
        allTextElements.push(textElement);
        
        currentWordElements.push({
            element: textElement,
            originalText: word.text,
            originalSize: word.size,
            originalX: x,
            originalY: y
        });
    });
    
    console.log(`Word cloud rendered in ${containerId} with ${sortedWords.length} words`);
    return svg;
}


// Smooth transition/rescale of word cloud to new data (Slide 3)
export function rescaleWordCloud(containerId, newData, duration = 800) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    const svg = container.querySelector('svg');
    if (!svg) {
        console.error('SVG not found, rendering fresh');
        renderWordCloud(containerId, newData, 0.9);
        return;
    }
    
    // Slide 3 percentage data for tooltips
    const data2Percentages = {
        'SHORT FILM': 41.75,
        'DANCE DIRECTION': 33.33,
        'MAKEUP HAIRSTYLING': 31.71,
        'SHORT SUBJECT': 25.0,
        'VISUAL EFFECTS': 20.54,
        'INTERNATIONAL FEATURE FILM': 19.13,
        'SOUND EDITING': 18.75,
        'MUSIC': 18.03,
        'SOUND MIXING': 17.84,
        'COSTUME DESIGN': 17.35,
        'ART DIRECTION': 17.27,
        'CINEMATOGRAPHY': 13.93,
        'SPECIAL ACHIEVEMENT AWARD': 12.5,
        'DOCUMENTARY': 11.97,
        'ACTOR IN A SUPPORTING ROLE': 9.43,
        'DIRECTING': 9.01,
        'FILM EDITING': 9.01,
        'ASSISTANT DIRECTOR': 8.33,
        'BEST PICTURE': 7.64,
        'ACTRESS IN A LEADING ROLE': 7.52,
        'ACTOR IN A LEADING ROLE': 6.32,
        'SOUND RECORDING': 18.25,
        'ACTRESS IN A SUPPORTING ROLE': 6.22,
        'WRITING': 6.05,
        'ANIMATED FEATURE FILM': 5.0
    };
    
    // Slide 2 counts for tooltips
    const slide2Counts = {
        'SHORT FILM': 103,
        'DANCE DIRECTION': 9,
        'MAKEUP HAIRSTYLING': 123,
        'VISUAL EFFECTS': 224,
        'MUSIC': 1126,
        'WRITING': 843,
        'SPECIAL ACHIEVEMENT AWARD': 24,
        'ACTRESS IN A LEADING ROLE': 412,
        'ART DIRECTION': 579,
        'CINEMATOGRAPHY': 596,
        'COSTUME DESIGN': 461,
        'DIRECTING': 477,
        'ACTOR IN A LEADING ROLE': 459,
        'ACTRESS IN A SUPPORTING ROLE': 418,
        'ACTOR IN A SUPPORTING ROLE': 403,
        'FILM EDITING': 433,
        'BEST PICTURE': 628,
        'ASSISTANT DIRECTOR': 24,
        'DOCUMENTARY': 117,
        'SOUND MIXING': 342,
        'SOUND EDITING': 144,
        'INTERNATIONAL FEATURE FILM': 115,
        'SPECIAL AWARD': 12,
        'SOUND RECORDING': 128,
        'HONORARY AWARD': 5,
        'SHORT SUBJECT': 4,
        'ANIMATED FEATURE FILM': 60
    };
    
    const isTransitioningToData2 = (newData === categoryFrequencyData2);
    const slide2Palette = ['#ccb68e', '#ae9f7c', '#88785d', '#5b5b5b', '#393939'];
    
    if (isTransitioningToData2) {
        addColorIntensityBar(containerId);
    } else {
        removeColorIntensityBar(containerId);
    }
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.querySelector('.wordcloud-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'wordcloud-tooltip hidden';
        document.body.appendChild(tooltip);
    }
    
    // Store all text elements for hover effect
    const allTextElements = Array.from(svg.querySelectorAll('text'));
    
    function handleMouseEnterSlide2(event, wordText, count) {
        allTextElements.forEach(el => {
            if (el !== event.target) {
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0.1';
            }
        });
        tooltip.innerHTML = `Category <strong>${wordText}</strong><br>Awarded to <strong>${count}</strong> Oscar Movies`;
        tooltip.style.left = (event.clientX + 15) + 'px';
        tooltip.style.top = (event.clientY + 15) + 'px';
        tooltip.classList.remove('hidden');
    }
    
    function handleMouseEnterSlide3(event, wordText, percentage, categoryColor) {
        allTextElements.forEach(el => {
            if (el !== event.target) {
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0.1';
            }
        });
        tooltip.innerHTML = `Category <strong style="color: ${categoryColor}">${wordText}</strong><br><strong style="color: ${categoryColor}">${percentage.toFixed(1)}%</strong> of nominated movies are Oscar Baits`;
        tooltip.style.left = (event.clientX + 15) + 'px';
        tooltip.style.top = (event.clientY + 15) + 'px';
        tooltip.classList.remove('hidden');
    }
    
    function handleMouseLeave() {
        allTextElements.forEach(el => {
            el.style.opacity = '1';
        });
        tooltip.classList.add('hidden');
    }
    
    // Calculate new sizes for each word
    const newSizeMap = {};
    Object.entries(newData).forEach(([text, value]) => {
        newSizeMap[text] = Math.max(5, Math.min(40, Math.pow(value, 2) * 40));
    });

    const textElements = svg.querySelectorAll('text');
    const centerX = cloudWidth / 2;
    const centerY = cloudHeight / 2;
    
    const wordsWithNewSizes = [];
    textElements.forEach((element, idx) => {
        const wordText = element.textContent;
        const newSize = newSizeMap[wordText];
        if (newSize) {
            const currentColor = element.getAttribute('fill');
            wordsWithNewSizes.push({
                text: wordText,
                size: newSize,
                oldSize: parseFloat(element.getAttribute('font-size')),
                oldX: parseFloat(element.getAttribute('x')),
                oldY: parseFloat(element.getAttribute('y')),
                element: element,
                newValue: newData[wordText],
                currentColor: currentColor,
                index: idx
            });
            
            // Update tooltip events based on current slide
            element.style.cursor = 'pointer';
            
            // Remove old listeners
            if (element._mouseEnterHandler) {
                element.removeEventListener('mouseenter', element._mouseEnterHandler);
            }
            if (element._mouseLeaveHandler) {
                element.removeEventListener('mouseleave', element._mouseLeaveHandler);
            }
            if (element._mouseMoveHandler) {
                element.removeEventListener('mousemove', element._mouseMoveHandler);
            }
            
            if (isTransitioningToData2) {
                // Slide 3 tooltips
                const percentage = data2Percentages[wordText] || (newData[wordText] * 100);
                const categoryColor = getColorByValue(newData[wordText]);
                element._mouseEnterHandler = (e) => handleMouseEnterSlide3(e, wordText, percentage, categoryColor);
            } else {
                // Slide 2 tooltips
                const count = slide2Counts[wordText] || 0;
                element._mouseEnterHandler = (e) => handleMouseEnterSlide2(e, wordText, count);
            }
            
            element._mouseLeaveHandler = handleMouseLeave;
            element._mouseMoveHandler = (e) => {
                tooltip.style.left = (e.clientX + 15) + 'px';
                tooltip.style.top = (e.clientY + 15) + 'px';
            };
            
            element.addEventListener('mouseenter', element._mouseEnterHandler);
            element.addEventListener('mouseleave', element._mouseLeaveHandler);
            element.addEventListener('mousemove', element._mouseMoveHandler);
        }
    });
    
    // Sort by new size for layout
    wordsWithNewSizes.sort((a, b) => b.size - a.size);
    
    // Calculate new positions using collision detection
    const placedWords = [];
    const newPositions = {};
    
    wordsWithNewSizes.forEach((word) => {
        const wordWidth = getTextWidth(word.text, word.size);
        const wordHeight = word.size * 1.15;
        
        let radius = 0;
        let angle = 0;
        let attempts = 0;
        const maxAttempts = 800;
        let posX = centerX, posY = centerY;
        let placed = false;
        
        while (!placed && attempts < maxAttempts) {
            if (attempts === 0) {
                posX = centerX;
                posY = centerY;
            } else {
                angle += 0.28;
                radius += 1.6;
                posX = centerX + Math.cos(angle) * radius;
                posY = centerY + Math.sin(angle) * radius;
            }
            
            posX = Math.max(wordWidth / 2 + 10, Math.min(cloudWidth - wordWidth / 2 - 10, posX));
            posY = Math.max(wordHeight / 2 + 10, Math.min(cloudHeight - wordHeight / 2 - 10, posY));
            
            const bounds = {
                x: posX - wordWidth / 2,
                y: posY - wordHeight / 2,
                width: wordWidth,
                height: wordHeight
            };
            
            let overlap = false;
            for (let p of placedWords) {
                if (bounds.x < p.x + p.width + 3 &&
                    bounds.x + bounds.width + 3 > p.x &&
                    bounds.y < p.y + p.height + 3 &&
                    bounds.y + bounds.height + 3 > p.y) {
                    overlap = true;
                    break;
                }
            }
            
            if (!overlap) {
                placed = true;
                placedWords.push(bounds);
                newPositions[word.text] = { x: posX, y: posY };
            }
            attempts++;
        }
        
        if (!placed) {
            const fallbackX = Math.random() * (cloudWidth - wordWidth - 20) + wordWidth / 2 + 10;
            const fallbackY = Math.random() * (cloudHeight - wordHeight - 20) + wordHeight / 2 + 10;
            newPositions[word.text] = { x: fallbackX, y: fallbackY };
        }
    });
    
    // Helper function to interpolate between two colors
    function interpolateColor(color1, color2, progress) {
        let r1, g1, b1, r2, g2, b2;
        
        if (color1.startsWith('#')) {
            r1 = parseInt(color1.slice(1, 3), 16);
            g1 = parseInt(color1.slice(3, 5), 16);
            b1 = parseInt(color1.slice(5, 7), 16);
        } else if (color1.startsWith('rgb')) {
            const match = color1.match(/\d+/g);
            r1 = parseInt(match[0]);
            g1 = parseInt(match[1]);
            b1 = parseInt(match[2]);
        } else {
            r1 = 204, g1 = 182, b1 = 142;
        }
        
        if (color2.startsWith('#')) {
            r2 = parseInt(color2.slice(1, 3), 16);
            g2 = parseInt(color2.slice(3, 5), 16);
            b2 = parseInt(color2.slice(5, 7), 16);
        } else if (color2.startsWith('rgb')) {
            const match = color2.match(/\d+/g);
            r2 = parseInt(match[0]);
            g2 = parseInt(match[1]);
            b2 = parseInt(match[2]);
        } else {
            r2 = 204, g2 = 182, b2 = 142;
        }
        
        const r = Math.floor(r1 + (r2 - r1) * progress);
        const g = Math.floor(g1 + (g2 - g1) * progress);
        const b = Math.floor(b1 + (b2 - b1) * progress);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Animate each text element
    wordsWithNewSizes.forEach((word) => {
        const newPos = newPositions[word.text];
        
        if (newPos) {
            let targetColor;
            if (isTransitioningToData2) {
                targetColor = getColorByValue(word.newValue);
            } else {
                targetColor = slide2Palette[word.index % slide2Palette.length];
            }
            
            const oldSize = word.oldSize;
            const newSize = word.size;
            const oldX = word.oldX;
            const oldY = word.oldY;
            const startTime = performance.now();
            const startColor = word.currentColor;
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(1, elapsed / duration);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentSize = oldSize + (newSize - oldSize) * easeProgress;
                const currentX = oldX + (newPos.x - oldX) * easeProgress;
                const currentY = oldY + (newPos.y - oldY) * easeProgress;
                
                word.element.setAttribute('font-size', `${currentSize}px`);
                word.element.setAttribute('x', currentX);
                word.element.setAttribute('y', currentY);
                
                const currentColor = interpolateColor(startColor, targetColor, easeProgress);
                word.element.setAttribute('fill', currentColor);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    word.element.setAttribute('fill', targetColor);
                }
            }
            
            requestAnimationFrame(animate);
        }
    });
    
    // After animation, ensure all text elements have correct opacity
    setTimeout(() => {
        const updatedTextElements = svg.querySelectorAll('text');
        updatedTextElements.forEach(el => {
            el.style.opacity = '1';
        });
    }, duration + 100);
    
    console.log(`Rescaling word cloud - ${wordsWithNewSizes.length} words, ${duration}ms`);
}

export { categoryFrequencyData1, categoryFrequencyData2 };