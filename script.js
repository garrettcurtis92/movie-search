const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
        searchInput.value = '';
    }
});

function searchMovies(query) {
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=f6ce2e0`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data);
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

function displayMovies(movies) {
    resultsDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-card'; // Add class for styling
        movieDiv.innerHTML = `
            <h2>${movie.Title} (${movie.Year})</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title} poster" width="150">
            <div class="details" style="display: none;"></div> <!-- Hidden details container -->
        `;
        movieDiv.addEventListener('click', () => fetchMovieDetails(movie.imdbID, movieDiv));
        resultsDiv.appendChild(movieDiv);
    });
}

function fetchMovieDetails(imdbID, movieDiv) {
    const detailsDiv = movieDiv.querySelector('.details');
    // Toggle visibility if already fetched
    if (detailsDiv.style.display === 'block') {
        detailsDiv.style.display = 'none';
        return;
    }
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=f6ce2e0`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                detailsDiv.innerHTML = `
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                `;
                detailsDiv.style.display = 'block';
            } else {
                detailsDiv.innerHTML = '<p>Details not available.</p>';
                detailsDiv.style.display = 'block';
            }
        })
        .catch(error => {
            detailsDiv.innerHTML = '<p>Failed to load details.</p>';
            detailsDiv.style.display = 'block';
            console.error('Error:', error);
        });
}