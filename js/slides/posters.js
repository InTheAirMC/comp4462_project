// // Function to render movie posters in 3x3 grid layout
// export function renderMoviePosters(movies) {
//     const border = document.getElementById('moviePostersBorder');
//     if (!border) return;
    
//     if (!movies || movies.length === 0) {
//         border.innerHTML = '<div class="loading-posters">No movies found. Try another search!</div>';
//         return;
//     }
    
//     const positions = [
//         'x0-y0', 'x1-y0', 'x3-y0', 'x4-y0',
//         'x0-y1', 'x1-y1', 'x3-y1', 'x4-y1',
//         'x0-y2', 'x1-y2', 'x3-y2', 'x4-y2'
//     ];
    
//     const maxPosters = Math.min(movies.length, positions.length);
//     let html = '';
    
//     for (let i = 0; i < maxPosters; i++) {
//         const movie = movies[i];
//         const position = positions[i];
        
//         html += `
//             <div class="poster-item ${position}" data-movie='${JSON.stringify(movie)}'>
//                 <img src="${movie.poster || 'images/placeholder.png'}" alt="${movie.name}" onerror="this.src='images/placeholder.png'">
//                 <div class="poster-tooltip">
//                     🎬 ${movie.name}<br>
//                     🍅 RT Score: ${movie.score}
//                 </div>
//             </div>
//         `;
//     }
    
//     border.innerHTML = html;
    
//     document.querySelectorAll('.poster-item').forEach(item => {
//         item.addEventListener('click', () => {
//             const movie = JSON.parse(item.getAttribute('data-movie'));
//             console.log('Clicked movie:', movie);
//         });
//     });
// }