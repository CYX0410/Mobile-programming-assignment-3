document.addEventListener('DOMContentLoaded', function() {
    const weatherApiKey = 'cd57c94913aa40358f9111256242406';
    const newsApiKey = 'd8589ff81289d079a7f70f7f69878dce';
    const covidApiKey = '84715ca26fmshaf7bfd9b2c34664p1b98b3jsn4d13552939d8';

    // Determine the current page and fetch data accordingly
    if (window.location.pathname.endsWith('weather.html')) {
        fetchWeatherData(weatherApiKey);
    } else if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(newsApiKey);
    } else if (window.location.pathname.endsWith('covid19.html')) {
        fetchCovidData(covidApiKey);
    }

    // Log user interaction
    logUserInteraction();

    // Function to fetch weather data
    function fetchWeatherData(apiKey) {
        fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Malaysia`)
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
        const tempC = data.current.temp_c;
        const tempF = (tempC * 9/5) + 32;
        const condition = data.current.condition.text;

        let weatherMessage = '';
        if (tempC > 30) {
            weatherMessage = 'It\'s quite hot outside!';
        } else if (tempC < 15) {
            weatherMessage = 'It\'s quite cold outside!';
        } else {
            weatherMessage = 'The weather is moderate.';
        }

        weatherDiv.innerHTML = `
            <p>Location: ${data.location.name}</p>
            <p>Temperature: ${tempC}°C / ${tempF.toFixed(2)}°F</p>
            <p>Condition: ${condition}</p>
            <p>${weatherMessage}</p>
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

    // Function to fetch COVID-19 data
    async function fetchCovidData(apiKey) {
        const url = 'https://covid-19-data.p.rapidapi.com/country/code?format=json&code=my';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'covid-19-data.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            displayCovidData(result);
        } catch (error) {
            console.error('Error fetching COVID-19 data:', error);
            showErrorMessage('COVID-19 data could not be fetched. Please try again later.');
        }
    }

    // Function to display COVID-19 data
    function displayCovidData(data) {
        const covidDiv = document.getElementById('covid-data');
        const covidInfo = data[0];
        
        const confirmed = covidInfo.confirmed;
        const deaths = covidInfo.deaths;
        const recovered = covidInfo.recovered;
        
        const mortalityRate = ((deaths / confirmed) * 100).toFixed(2);
        const recoveryRate = ((recovered / confirmed) * 100).toFixed(2);

        let covidMessage = '';
        let messageClass = '';

        if (mortalityRate > 3) {
            covidMessage = 'Warning: High mortality rate detected!';
            messageClass = 'warning';
        } else if (recoveryRate > 70) {
            covidMessage = 'Good news: High recovery rate observed!';
            messageClass = 'good-news';
        } else {
            covidMessage = 'Stay safe and follow health guidelines.';
            messageClass = 'info';
        }

        const table = `
            <table>
                <tr><th>Country</th><td>${covidInfo.country}</td></tr>
                <tr><th>Confirmed Cases</th><td>${confirmed}</td></tr>
                <tr><th>Deaths</th><td>${deaths}</td></tr>
                <tr><th>Recovered</th><td>${recovered}</td></tr>
                <tr><th>Mortality Rate</th><td>${mortalityRate}%</td></tr>
                <tr><th>Recovery Rate</th><td>${recoveryRate}%</td></tr>
                <tr><th>Message</th><td class="${messageClass}"><strong>${covidMessage}</strong></td></tr>
            </table>
        `;

        covidDiv.innerHTML = table;
    }

    // Function to show error message
    function showErrorMessage(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
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
