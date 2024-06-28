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
        }
    }

    // Function to display COVID-19 data
    function displayCovidData(data) {
        const covidDiv = document.getElementById('covid-data');
        const covidInfo = data[0];
        
        const confirmed = covidInfo.confirmed;
        const deaths = covidInfo.deaths;
        const recovered = covidInfo.recovered;
        const active = confirmed - (deaths + recovered);
        
        const mortalityRate = ((deaths / confirmed) * 100).toFixed(2);
        const recoveryRate = ((recovered / confirmed) * 100).toFixed(2);

        let covidMessage = '';
        if (confirmed > 1000000) {
            covidMessage = 'Warning: The number of confirmed cases is very high!';
        } else if (deaths > 10000) {
            covidMessage = 'Warning: The death toll is quite significant!';
        } else if (recovered > 500000) {
            covidMessage = 'Good news: Many people have recovered!';
        } else {
            covidMessage = 'Stay safe and follow health guidelines.';
        }

        covidDiv.innerHTML = `
            <p>Country: ${covidInfo.country}</p>
            <p>Confirmed Cases: ${confirmed}</p>
            <p>Deaths: ${deaths}</p>
            <p>Recovered: ${recovered}</p>
            <p>Active Cases: ${active}</p>
            <p>Mortality Rate: ${mortalityRate}%</p>
            <p>Recovery Rate: ${recoveryRate}%</p>
            <p>${covidMessage}</p>
        `;
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
