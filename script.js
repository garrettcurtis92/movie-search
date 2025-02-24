const form = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        resultsDiv.innerHTML = '<div class="spinner"></div>'; // Show spinner
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
    resultsDiv.innerHTML = ''; // Clear spinner
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.className = 'movie-card';
        movieDiv.innerHTML = `
            <h2>${movie.Title} (${movie.Year})</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title} poster" width="150">
            <div class="details" style="display: none;"></div>
        `;
        movieDiv.addEventListener('click', () => fetchMovieDetails(movie.imdbID, movieDiv));
        resultsDiv.appendChild(movieDiv);
    });
}

function fetchMovieDetails(imdbID, movieDiv) {
    const detailsDiv = movieDiv.querySelector('.details');
    if (detailsDiv.style.display === 'block') {
        detailsDiv.style.display = 'none';
        return;
    }
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=f6ce2e0`;
    console.log('Fetching details for:', imdbID, 'URL:', url); // Log URL
    fetch(url)
        .then(response => {
            console.log('Details Response Status:', response.status);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('Details API Response:', data);
            if (data.Response === 'True') {
                detailsDiv.innerHTML = `
                    <p><strong>Director:</strong> ${data.Director || 'N/A'}</p>
                    <p><strong>Plot:</strong> ${data.Plot || 'No plot available'}</p>
                    <p><strong>Genre:</strong> ${data.Genre || 'N/A'}</p>
                    <p><strong>Runtime:</strong> ${data.Runtime || 'N/A'}</p>
                    <p><strong>IMDb Rating:</strong> ${data.imdbRating || 'N/A'}/10</p>
                `;
                detailsDiv.style.display = 'block';
                detailsDiv.classList.add('show');
            } else {
                detailsDiv.innerHTML = `<p>Details not available: ${data.Error || 'Unknown error'}</p>`;
                detailsDiv.style.display = 'block';
                detailsDiv.classList.add('show');
            }
        })
        .catch(error => {
            detailsDiv.innerHTML = '<p>Failed to load details.</p>';
            detailsDiv.style.display = 'block';
            detailsDiv.classList.add('show');
            console.error('Details Error:', error);
        });
}