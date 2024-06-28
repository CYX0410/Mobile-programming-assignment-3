document.addEventListener('DOMContentLoaded', function() {
    const weatherApiKey = 'cd57c94913aa40358f9111256242406';
    const newsApiKey = 'd8589ff81289d079a7f70f7f69878dce';
    const youtubeApiKey = '84715ca26fmshaf7bfd9b2c34664p1b98b3jsn4d13552939d8';
    // Determine the current page and fetch data accordingly
    if (window.location.pathname.endsWith('weather.html')) {
        fetchWeatherData(weatherApiKey);
    } else if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(newsApiKey);
    } else if (window.location.pathname.endsWith('social.html')) {
        fetchYouTubeData(youtubeApiKey);
    }

    // Log user interaction
    logUserInteraction();

    // Function to fetch weather data
    function fetchWeatherData() {
        fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Malaysia`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data);
                displayWeatherChart(data);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    // Function to display weather information
    function displayWeather(data) {
        const weatherDiv = document.getElementById('weather-data');
        weatherDiv.innerHTML = `
            <p>Location: ${data.location.name}</p>
            <p>Temperature: ${data.current.temp_c}°C</p>
            <p>Condition: ${data.current.condition.text}</p>
        `;
    }

    // Function to display weather chart
    function displayWeatherChart(data) {
        const ctx = document.getElementById('weather-chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Temperature'],
                datasets: [{
                    label: 'Temperature in °C',
                    data: [data.current.temp_c],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            }
        });
    }

    // Function to fetch news data
    function fetchNewsData(apiKey) {
        fetch(`https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en`)
            .then(response => response.json())
            .then(data => {
                const newsDiv = document.getElementById('news-data');
                newsDiv.innerHTML = ''; // Clear previous content if any
                data.articles.forEach(article => {
                    newsDiv.innerHTML += `
                        <div class="news-item">
                            <img src="${article.image}" alt="Article Image">
                            <div class="news-content">
                                <h3>${article.title}</h3>
                                <p>${article.description}</p>
                                <a href="${article.url}" class="read-more" target="_blank">Read more</a>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(error => console.error('Error fetching news data:', error));
    }

            // Function to fetch YouTube data
            async function fetchYouTubeData(apiKey) {
                const url = 'https://youtube-data8.p.rapidapi.com/auto-complete/?q=cartoons_for_kids&hl=en&gl=US';
                const options = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': apiKey,
                        'x-rapidapi-host': 'youtube-data8.p.rapidapi.com'
                    }
                };

                try {
                    const response = await fetch(url, options);
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    const result = await response.json();
                    console.log('API Response:', result); // Log the result for debugging
                    displayYouTubeResults(result);
                } catch (error) {
                    console.error('Error fetching YouTube data:', error);
                }
            }

            // Function to display YouTube results
            function displayYouTubeResults(data) {
                const resultsDiv = document.getElementById('results');
                if (!resultsDiv) {
                    throw new Error('Element with ID "results" not found');
                }

                // Log the data structure for debugging
                console.log('YouTube Data Structure:', data);

                // Check if suggestions array exists and is not empty
                if (data && data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
                    // Clear previous content if any
                    resultsDiv.innerHTML = '';

                    // Display each suggestion as a separate item
                    data.suggestions.forEach(item => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'item';
                        itemDiv.innerHTML = `
                            <div class="title">${item}</div>
                        `;
                        resultsDiv.appendChild(itemDiv);
                    });
                } else {
                    resultsDiv.innerHTML = '<p>No suggestions found.</p>';
                }
            }
    // Function to log user interaction
    function logUserInteraction() {
        const date = new Date();
        const logEntry = {
            date: date.toISOString(),
            page: window.location.pathname
        };

        let logs = JSON.parse(localStorage.getItem('userLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('userLogs', JSON.stringify(logs));
    }
});

