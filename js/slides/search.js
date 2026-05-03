import { movieDatabase } from '../data/movieData.js';
import { renderMoviePosters } from './posters.js';

let searchInitialized = false;

export async function searchMovies(query) {
    const searchStatus = document.getElementById('searchStatus');
    
    if (!query.trim()) {
        if (searchStatus) searchStatus.innerHTML = '✨ Showing all Oscar Bait movies';
        return movieDatabase;
    }
    
    const filtered = movieDatabase.filter(movie => 
        movie.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        if (searchStatus) searchStatus.innerHTML = `✅ Found ${filtered.length} movies matching "${query}"`;
        return filtered;
    } else {
        if (searchStatus) searchStatus.innerHTML = `❌ No movies found for "${query}". Try "Green" or "Book"`;
        return [];
    }
}

export function initSearchSlide() {
    if (searchInitialized) return;
    
    const searchInput = document.getElementById('movieSearchInput');
    if (!searchInput) return;
    
    searchInitialized = true;
    
    searchMovies('').then(movies => renderMoviePosters(movies));
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = e.target.value;
            const movies = await searchMovies(query);
            renderMoviePosters(movies);
        }, 300);
    });
}