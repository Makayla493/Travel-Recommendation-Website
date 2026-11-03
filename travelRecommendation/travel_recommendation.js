document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');
    const resultsContainer = document.getElementById('resultsContainer');

    // Verify fetch capability suring development
    fetch('./travel_recommendations_api.json')
    .then(response => response.json())
    .then(data => console.log('API Data loaded successfully:', data))
    .catch(error => console.error('Error fetching API:', error));
    if (btnSearch) {
        btnSearch.addEventListener('click', searchRecommendations);
    }
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
        searchInput.value ='';
        resultsContainer.innerHTML = '';
        });
    }
    function searchRecommendations() {
        const input = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML ='';
        if (!input) return;

        fetch('./travel_recommendation_api.json')
          .then(response => response.json())
          .then(data => {
            let results = [];
    
            if (input.includes('beach')) {
              results = data.beaches;
            } else if (input.includes('temple')) {
              results = data.temples;
            } else {
              // Check for country name match
              const countryMatch = data.countries.find(c => c.name.toLowerCase().includes(input));
              if (countryMatch) {
                results = countryMatch.cities;
              }
            }
    
            displayResults(results);
          })
          .catch(error => console.error('Fetch error:', error));
      }
    
      function displayResults(items) {
        if (items.length === 0) {
          resultsContainer.innerHTML = '<p class="no-results">No matches found. Try searching for "beach", "temple", or a country like "Australia".</p>';
          return;
        }
    
        items.forEach(item => {
          const card = document.createElement('div');
          card.classList.add('result-card');
          card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <button class="btn-visit">Visit</button>
          `;
          resultsContainer.appendChild(card);
        });
      }
    }); 
