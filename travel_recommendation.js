document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('btnSearch');
    const resetBtn = document.getElementById('btnReset');
    const inputField = document.getElementById('conditionInput');
    const resultsContainer = document.getElementById('recommendationResults');
    const bookNowBtn = document.querySelector('.cta-btn');

    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
            if (inputField) inputField.focus();
        });
    }

    if (searchBtn) searchBtn.addEventListener('click', searchRecommendations);
    if (resetBtn) resetBtn.addEventListener('click', clearResults);

    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRecommendations();
            }
        });
    }

    function searchRecommendations() {
        const query = inputField.value.trim().toLowerCase();
        resultsContainer.innerHTML = '';

        if (!query) return;

        fetch('travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                let matches = [];

                // Flexible keyword checking for beaches, temples, or country/city names
                if (query.includes('beach')) {
                    matches = data.beaches;
                } else if (query.includes('temple')) {
                    matches = data.temples;
                } else {
                    data.countries.forEach(country => {
                        if (country.name.toLowerCase().includes(query)) {
                            // If user types a country like "Australia", push all its cities
                            matches.push(...country.cities);
                        } else {
                            // Check individual cities
                            country.cities.forEach(city => {
                                if (city.name.toLowerCase().includes(query) || city.description.toLowerCase().includes(query)) {
                                    matches.push(city);
                                }
                            });
                        }
                    });
                }

                displayResults(matches);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                resultsContainer.innerHTML = '<p class="no-result">Error loading recommendation data. Please check file path.</p>';
            });
    }

    function displayResults(items) {
        if (!items || items.length === 0) {
            resultsContainer.innerHTML = '<p class="no-result">No matching recommendations found. Try searching "beach", "temple", or "Australia".</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('result-card');
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button class="card-btn">Visit</button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function clearResults() {
        if (inputField) inputField.value = '';
        if (resultsContainer) resultsContainer.innerHTML = '';
    }
});