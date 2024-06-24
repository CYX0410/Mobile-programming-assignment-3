document.addEventListener('DOMContentLoaded', function() {
    const weatherApiKey = 'cd57c94913aa40358f9111256242406';
    const newsApiKey = 'd8589ff81289d079a7f70f7f69878dce';
    const twitterBearerToken = 'AAAAAAAAAAAAAAAAAAAAAM7muQEAAAAAFoY6D4%2FusU1Ko77BO9A0QrTZqIc%3D9NEzCTb7pWGXBCNKPLbJTZurtlP17oBbH9AphKHqmOgS8s5z9G';

    // Determine the current page and fetch data accordingly
    if (window.location.pathname.endsWith('weather.html')) {
        fetchWeatherData(weatherApiKey);
    } else if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(newsApiKey);
    } else if (window.location.pathname.endsWith('social.html')) {
        fetchTwitterData(twitterBearerToken);
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
                        <div>
                            <h3>${article.title}</h3>
                            <p>${article.description}</p>
                            <img src="${article.image}" alt="Article Image">
                            <p><a href="${article.url}" target="_blank">Read more</a></p>
                        </div>
                    `;
                });
            })
            .catch(error => console.error('Error fetching news data:', error));
    }
    // Function to display news articles
    function displayNews(articles) {
        const newsDiv = document.getElementById('news-data');
        newsDiv.innerHTML = ''; // Clear previous content
        articles.forEach(article => {
            newsDiv.innerHTML += `
                <div>
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                </div>
            `;
        });
    }

    function fetchTwitterData(bearerToken) {
        const twitterUsername = 'twitterdev'; // Replace with the username you want to fetch
    
        fetch(`https://api.twitter.com/2/users/by/username/${twitterUsername}`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const socialDiv = document.getElementById('social-media-data');
            socialDiv.innerHTML = `
                <div>
                    <h3>Twitter User: ${data.data.name}</h3>
                    <p>Username: @${data.data.username}</p>
                    <p>Description: ${data.data.description}</p>
                </div>
            `;
        })
        .catch(error => console.error('Error fetching Twitter data:', error));
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

