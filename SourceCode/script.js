document.addEventListener('DOMContentLoaded', function() {
    const weatherApiKey = 'cd57c94913aa40358f9111256242406';
    const newsApiKey = 'd8589ff81289d079a7f70f7f69878dce';
    // Determine the current page and fetch data accordingly
    if (window.location.pathname.endsWith('weather.html')) {
        fetchWeatherData(weatherApiKey);
    } else if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(newsApiKey);
    } else if (window.location.pathname.endsWith('calculator.html')) {

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

