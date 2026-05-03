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
    rightLabel.style.color = '#801B1D';
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








// Transition to Slide 4 - move original text elements to left column and create oscar statues
export function filterToLeftColumn(containerId, targetWords, duration = 1000) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
        // CHECK IF STATUES ALREADY EXIST - if yes, don't recreate
    const existingMainContainer = document.getElementById('oscarStatuesMainContainer');
    if (existingMainContainer && existingMainContainer.children.length > 0) {
        console.log('Statues already exist, skipping creation');
        return;
    }

    // Hide gradient bar when filtering to left column
    const gradientBar = container.querySelector('.color-intensity-bar');
    if (gradientBar) {
        gradientBar.style.transition = 'opacity 0.4s ease';
        gradientBar.style.opacity = '0';
    }
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    const textElements = svg.querySelectorAll('text');
    const targetWordList = ['SHORT FILM', 'DANCE DIRECTION', 'MAKEUP HAIRSTYLING', 'VISUAL EFFECTS'];
    
    // Ratio data for each category (how many statues out of 10 should be red)
    const categoryRatios = {
        'SHORT FILM': 4.1,
        'DANCE DIRECTION': 3.3,
        'MAKEUP HAIRSTYLING': 3.1,
        'VISUAL EFFECTS': 2.9
    };
    
    console.log('Starting filterToLeftColumn - creating oscar statues');
    
    // Get or create main container for all statues
    let statuesMainContainer = document.getElementById('oscarStatuesMainContainer');
    if (!statuesMainContainer) {
        statuesMainContainer = document.createElement('div');
        statuesMainContainer.className = 'oscar-statues-main-container';
        statuesMainContainer.id = 'oscarStatuesMainContainer';
        statuesMainContainer.style.position = 'relative';
        statuesMainContainer.style.width = '100%';
        statuesMainContainer.style.minHeight = '400px';
        
        // Find where to insert it
        const wordsContainer = document.getElementById('filteredWordsContainer');
        if (wordsContainer && wordsContainer.parentNode) {
            wordsContainer.parentNode.insertBefore(statuesMainContainer, wordsContainer.nextSibling);
        } else {
            container.appendChild(statuesMainContainer);
        }
    }
    
    // Clear existing content
    statuesMainContainer.innerHTML = '';
    
    // Store original position data and reposition texts
    textElements.forEach(element => {
        const wordText = element.textContent;
        
        if (targetWordList.includes(wordText)) {
            const currentXAttr = parseFloat(element.getAttribute('x'));
            const currentYAttr = parseFloat(element.getAttribute('y'));
            const currentSize = parseFloat(element.getAttribute('font-size'));
            const currentColor = element.getAttribute('fill');
            const currentAnchor = element.getAttribute('text-anchor') || 'middle';
            
            originalWordData[wordText] = {
                attrX: currentXAttr,
                attrY: currentYAttr,
                size: currentSize,
                color: currentColor,
                anchor: currentAnchor,
                element: element
            };
        }
    });
    
    // Force reflow
    void document.body.offsetHeight;
    
    // Animate target words to new position
    const textPositions = {};
    
    textElements.forEach(element => {
        const wordText = element.textContent;
        
        if (targetWordList.includes(wordText)) {
            const original = originalWordData[wordText];
            const index = targetWordList.indexOf(wordText);
            
            // Target position for text - left column
            const targetX = 40;
            const targetY = 50 + (index * 65);
            
            textPositions[wordText] = { x: targetX, y: targetY, index: index };
            
            const deltaX = targetX - original.attrX;
            const deltaY = targetY - original.attrY;
            
            element.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.4, 1.1), font-size ${duration}ms cubic-bezier(0.2, 0.9, 0.4, 1.1)`;
            element.style.transform = 'translate(0px, 0px)';
            
            void element.offsetHeight;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            element.setAttribute('font-size', '18px');
            element.setAttribute('text-anchor', 'start');
            element.style.opacity = '1';
        } else {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
        }
    });
    
    // Function to create red overlay for a statue
    function addRedOverlay(statueWrapper, percentage) {
        const overlayDiv = document.createElement('div');
        overlayDiv.style.position = 'absolute';
        overlayDiv.style.top = '0';
        overlayDiv.style.left = '0';
        overlayDiv.style.width = '100%';
        overlayDiv.style.height = '100%';
        overlayDiv.style.background = '#cc0000';
        overlayDiv.style.clipPath = `polygon(0% 0%, ${percentage}% 0%, ${percentage}% 100%, 0% 100%)`;
        overlayDiv.style.borderRadius = '4px';
        overlayDiv.style.pointerEvents = 'none';
        overlayDiv.style.opacity = '0.85';
        
        statueWrapper.style.position = 'relative';
        statueWrapper.appendChild(overlayDiv);
    }
    
    // Create all statues at once per column
    setTimeout(() => {
        targetWordList.forEach((category, categoryIdx) => {
            // Create card for this category
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.style.display = 'flex';
            categoryCard.style.flexDirection = 'column';
            categoryCard.style.marginBottom = '25px';
            categoryCard.style.position = 'relative';  // ← REQUIRED for 'top' to work
            categoryCard.style.top = '-100px';          // ← Moves up 30px
            categoryCard.style.opacity = '0';
            categoryCard.style.transition = 'opacity 0.5s ease';
            
            // Statues row - all statues appear together
            const statuesRow = document.createElement('div');
            statuesRow.style.display = 'flex';
            statuesRow.style.flexDirection = 'row';
            statuesRow.style.gap = '0px';
            statuesRow.style.alignItems = 'center';
            statuesRow.style.marginLeft = '700px';
            statuesRow.style.flexWrap = 'wrap';
            
            const totalStatues = 10;
            const redCountFull = Math.floor(categoryRatios[category]);
            const redFraction = categoryRatios[category] - redCountFull;
            
            // Create ALL statues for this category at once
            for (let i = 0; i < totalStatues; i++) {
                const statueWrapper = document.createElement('div');
                statueWrapper.className = 'statue-wrapper';
                statueWrapper.style.display = 'inline-block';
                statueWrapper.style.position = 'relative';
                statueWrapper.style.width = '50px';
                statueWrapper.style.height = '50px';
                statueWrapper.style.margin = '0 0px';
                statueWrapper.style.cursor = 'pointer';
                
                const statueImg = document.createElement('img');
                statueImg.src = 'images/oscarstatue.png';
                statueImg.alt = 'Oscar Statue';
                statueImg.style.width = '100%';
                statueImg.style.height = '100%';
                statueImg.style.objectFit = 'contain';
                statueImg.style.transition = 'all 0.3s ease';
                
                statueWrapper.appendChild(statueImg);
                statuesRow.appendChild(statueWrapper);
                
                // Color the statue based on ratio
                if (i < redCountFull) {
                    addRedOverlay(statueWrapper, 100);
                    statueImg.style.transform = 'scale(1.05)';
                } else if (i === redCountFull && redFraction > 0) {
                    const slicePercent = redFraction * 100;
                    addRedOverlay(statueWrapper, slicePercent);
                    statueImg.style.transform = 'scale(1.02)';
                }
            }
            
            categoryCard.appendChild(statuesRow);
            
            // Label aligned left-bottom with statues
            const labelContainer = document.createElement('div');
            labelContainer.style.marginLeft = '700px';
            labelContainer.style.marginTop = '0px';
            labelContainer.style.textAlign = 'left';
            
            const label = document.createElement('div');
            label.className = 'statue-ratio-label';
            label.textContent = `${categoryRatios[category]}/10 Oscar Bait ratio`;
            label.style.fontSize = '13px';
            label.style.fontFamily = "'Inter', sans-serif";
            label.style.fontWeight = '600';
            label.style.color = '#ffbc6e';
            label.style.padding = '6px 12px';
            label.style.backgroundColor = 'rgba(0,0,0,0.65)';
            label.style.borderRadius = '25px';
            label.style.display = 'inline-block';
            label.style.backdropFilter = 'blur(4px)';
            label.style.border = '1px solid rgba(255,180,71,0.3)';
            
            labelContainer.appendChild(label);
            categoryCard.appendChild(labelContainer);
            
            statuesMainContainer.appendChild(categoryCard);
            
            // Fade in the card
            setTimeout(() => {
                categoryCard.style.opacity = '1';
            }, categoryIdx * 200);
            
            console.log(`Added ${totalStatues} statues and label for ${category}`);
        });
    }, duration + 100);
    
    // Store created containers for cleanup
    window.currentStatuesMainContainer = statuesMainContainer;
}

// Restore function - remove statues
export function restoreFromLeftColumn(containerId, originalData, duration = 1000) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Show gradient bar when restoring
    const gradientBar = container.querySelector('.color-intensity-bar');
    if (gradientBar) {
        gradientBar.style.transition = 'opacity 0.6s ease';
        gradientBar.style.opacity = '1';
    }
    
    const svg = container.querySelector('svg');
    if (!svg) return;
    
    const textElements = svg.querySelectorAll('text');
    const targetWordList = ['SHORT FILM', 'DANCE DIRECTION', 'MAKEUP HAIRSTYLING', 'VISUAL EFFECTS'];
    
    console.log('Starting restoreFromLeftColumn - removing oscar statues');
    
    // Remove statues main container
    const statuesMainContainer = document.getElementById('oscarStatuesMainContainer');
    if (statuesMainContainer) {
        statuesMainContainer.style.transition = 'opacity 0.4s ease';
        statuesMainContainer.style.opacity = '0';
        setTimeout(() => {
            if (statuesMainContainer && statuesMainContainer.parentNode) {
                statuesMainContainer.remove();
            }
        }, 400);
    }
    
    textElements.forEach(element => {
        const wordText = element.textContent;
        
        if (targetWordList.includes(wordText) && originalWordData[wordText]) {
            const original = originalWordData[wordText];
            
            // Set transition
            element.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.4, 1.1), font-size ${duration}ms cubic-bezier(0.2, 0.9, 0.4, 1.1)`;
            
            // Force reflow
            void element.offsetHeight;
            
            // Reset transform and restore original attributes
            element.style.transform = 'translate(0px, 0px)';
            element.setAttribute('x', original.attrX);
            element.setAttribute('y', original.attrY);
            element.setAttribute('font-size', `${original.size}px`);
            element.setAttribute('fill', original.color);
            element.setAttribute('text-anchor', original.anchor);
            element.style.opacity = '1';
            
            // Also reset any inline styles
            element.style.fontSize = '';
        } else if (!targetWordList.includes(wordText)) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '1';
        }
    });
    
    // Clean up after animation
    setTimeout(() => {
        textElements.forEach(element => {
            const wordText = element.textContent;
            if (targetWordList.includes(wordText) && originalWordData[wordText]) {
                element.style.transform = '';
            }
        });
    }, duration);
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

// Render initial word cloud
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
    
    const words = Object.entries(data).map(([text, value]) => ({
        text: text,
        size: Math.max(5, Math.min(40, Math.pow(value, 2) * 40)),
        value: value
    }));
    
    const sortedWords = [...words].sort((a, b) => b.size - a.size);
    // Slide 2 color palette - warm earthy tones
    const slide2ColorPalette = ['#ccb68e', '#ae9f7c', '#88785d', '#5b5b5b', '#393939'];
    const placedWords = [];
    const centerX = cloudWidth / 2;
    const centerY = cloudHeight / 2;
    
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
        textElement.setAttribute('text-anchor', 'middle');
        // Use slide 2 color palette
        textElement.setAttribute('fill', slide2ColorPalette[idx % slide2ColorPalette.length]);
        textElement.setAttribute('opacity', opacityLevel);
        textElement.textContent = word.text;
        
        svg.appendChild(textElement);
        
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

// Smooth transition/rescale of word cloud to new data
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
    
    // Determine which dataset we're transitioning to
    const isTransitioningToData2 = (newData === categoryFrequencyData2);
    const slide2Palette = ['#ccb68e', '#ae9f7c', '#88785d', '#5b5b5b', '#393939'];
    
    // Add color intensity bar if transitioning to Slide 3 (categoryFrequencyData2)
    if (isTransitioningToData2) {
        addColorIntensityBar(containerId);
    } else {
        // Remove color intensity bar when leaving Slide 3
        removeColorIntensityBar(containerId);
    }
    
    // Calculate new sizes for each word
    const newSizeMap = {};
    Object.entries(newData).forEach(([text, value]) => {
        newSizeMap[text] = Math.max(5, Math.min(40, Math.pow(value, 2) * 40));
    });

    // Store current positions and calculate new positions
    const textElements = svg.querySelectorAll('text');
    const centerX = cloudWidth / 2;
    const centerY = cloudHeight / 2;
    
    // Get all words with their new sizes
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
        // Parse RGB values
        let r1, g1, b1, r2, g2, b2;
        
        // Handle hex colors
        if (color1.startsWith('#')) {
            r1 = parseInt(color1.slice(1, 3), 16);
            g1 = parseInt(color1.slice(3, 5), 16);
            b1 = parseInt(color1.slice(5, 7), 16);
        } 
        // Handle rgb() format
        else if (color1.startsWith('rgb')) {
            const match = color1.match(/\d+/g);
            r1 = parseInt(match[0]);
            g1 = parseInt(match[1]);
            b1 = parseInt(match[2]);
        }
        // Handle slide 2 palette colors (already hex)
        else {
            r1 = 204, g1 = 182, b1 = 142; // default #ccb68e
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
            // Calculate target color
            let targetColor;
            if (isTransitioningToData2) {
                // Slide 3: Red-Green gradient using getColorByValue
                targetColor = getColorByValue(word.newValue);
            } else {
                // Slide 2: Earthy palette - use consistent color based on word index
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
                
                // Animate size and position
                const currentSize = oldSize + (newSize - oldSize) * easeProgress;
                const currentX = oldX + (newPos.x - oldX) * easeProgress;
                const currentY = oldY + (newPos.y - oldY) * easeProgress;
                
                word.element.setAttribute('font-size', `${currentSize}px`);
                word.element.setAttribute('x', currentX);
                word.element.setAttribute('y', currentY);
                
                // Animate color throughout the entire transition
                const currentColor = interpolateColor(startColor, targetColor, easeProgress);
                word.element.setAttribute('fill', currentColor);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Ensure final color is exactly set
                    word.element.setAttribute('fill', targetColor);
                }
            }
            
            requestAnimationFrame(animate);
        }
    });
    
    console.log(`Rescaling and repositioning word cloud - ${wordsWithNewSizes.length} words, ${duration}ms`);
}

export { categoryFrequencyData1, categoryFrequencyData2 };