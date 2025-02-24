// Get DOM elements
const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

// Handle form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
        searchInput.value = '';
    }
});

// Search movies via OMDB API
function searchMovies(query) {
    const url = `http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=f6ce2e0`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Keep for debugging
            if (data.Response === 'True') {
                displayMovies(data.Search);
            } else {
                resultsDiv.innerHTML = `<p>No movies found for "${query}".</p>`;
            }
        })
        .catch(error => {
            resultsDiv.innerHTML = '<p>Something went wrong. Try again!</p>';
            console.error('Error:', error);
        });
}

// Display movie results
function displayMovies(movies) {
    resultsDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.innerHTML = `
            <h2>${movie.Title} (${movie.Year})</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title} poster" width="150">
        `;
        resultsDiv.appendChild(movieDiv);
    });
}