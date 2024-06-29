document.addEventListener('DOMContentLoaded', function() {
    const weatherApiKey = 'b68064539bb443d06896e37574e5b76f';
    const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q=';
    const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&q=';
    const newsApiKey = 'd8589ff81289d079a7f70f7f69878dce';
    const covidApiKey = '84715ca26fmshaf7bfd9b2c34664p1b98b3jsn4d13552939d8';
    var city = "";
    let weatherChart;

    // Weather API
    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");

    // Determine the current page and fetch data accordingly
    if (window.location.pathname.endsWith('index.html')) {
        logUserInteraction('Visited');
    } else if (window.location.pathname.endsWith('weather.html')) {
        checkWeather(city);
        logUserInteraction('Accessed weather page');
    } else if (window.location.pathname.endsWith('news.html')) {
        fetchNewsData(newsApiKey);
        logUserInteraction('Accessed news page');
    } else if (window.location.pathname.endsWith('covid19.html')) {
        fetchCovidData(covidApiKey);
        logUserInteraction('Accessed COVID-19 page');
    } else if (window.location.pathname.endsWith('logs.html')) {
        logUserInteraction('Accessed logging page');
        displayUserLogs();
    }

    // Function to fetch weather data
    async function checkWeather(city){
        const response = await fetch(weatherApiUrl + city + `&appid=${weatherApiKey}`);
        
        if(response.status == 404){
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        }else{
            var data = await response.json();

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            if(data.weather[0].main == "Clouds"){
                weatherIcon.src = "image/weather/clouds.png";
            }
            else if(data.weather[0].main == "Clear"){
                weatherIcon.src = "image/weather/clear.png";
            }
            else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "image/weather/rain.png";
            }
            else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "image/weather/mist.png";
            }
            else if(data.weather[0].main == "Snow"){
                weatherIcon.src = "image/weather/snow.png";
            }
            else if(data.weather[0].main == "Thunderstorm"){
                weatherIcon.src = "image/weather/thunderstorm.png";
            }
            else if(data.weather[0].main == "Drizzle"){
                weatherIcon.src = "image/weather/drizzle.png";
            }
            else if(data.weather[0].main == "Smoke"){
                weatherIcon.src = "image/weather/smoke.png";
            }
            else if(data.weather[0].main == "Haze"){
                weatherIcon.src = "image/weather/haze.png";
            }
            else if(data.weather[0].main == "Dust" || data.weather[0].main == "Ash"){
                weatherIcon.src = "image/weather/dustAsh.png";
            }
            else if(data.weather[0].main == "Fog"){
                weatherIcon.src = "image/weather/fog.png";
            }
            else if(data.weather[0].main == "Sand"){
                weatherIcon.src = "image/weather/sand.png";
            }
            else if(data.weather[0].main == "Tornado"){
                weatherIcon.src = "image/weather/tornado.png";
            }

            document.querySelector(".weather").style.display = "block";
            document.querySelector(".error").style.display = "none";

            // Fetch 3-hour interval forecast
            fetchForecast3HourInterval(city);

            // Fetch 5-day forecast
            fetchForecast5Days(city);
        }
    }

    // Function to search city weather
    searchBtn.addEventListener("click", ()=>{
        checkWeather(searchBox.value);
    })

    // Fetch 3-hour interval forecast data
    async function fetchForecast3HourInterval(city) {
        const response = await fetch(forecastApiUrl + city + `&appid=${weatherApiKey}`);
        const data = await response.json();

        const forecast3hRow = document.getElementById('forecast-3h-row');
        forecast3hRow.innerHTML = ''; // Clear previous data

        const forecastList = data.list.slice(0, 5); // Get 3-hour interval forecast (6 * 2-hour intervals)
        
        forecastList.forEach(forecast => {
            const forecastHour = document.createElement('div');
            forecastHour.classList.add('forecast-hour');

            const time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let iconUrl = `image/weather/clouds.png`;
            const temp = Math.round(forecast.main.temp) + '°C';

            if(forecast.weather[0].main == "Clouds"){
                iconUrl = "image/weather/clouds.png";
            }
            else if(forecast.weather[0].main == "Clear"){
                iconUrl = "image/weather/clear.png";
            }
            else if(forecast.weather[0].main == "Rain"){
                iconUrl = "image/weather/rain.png";
            }
            else if(forecast.weather[0].main == "Mist"){
                iconUrl = "image/weather/mist.png";
            }
            else if(forecast.weather[0].main == "Snow"){
                iconUrl = "image/weather/snow.png";
            }
            else if(forecast.weather[0].main == "Thunderstorm"){
                iconUrl = "image/weather/thunderstorm.png";
            }
            else if(forecast.weather[0].main == "Drizzle"){
                iconUrl = "image/weather/drizzle.png";
            }
            else if(forecast.weather[0].main == "Smoke"){
                iconUrl = "image/weather/smoke.png";
            }
            else if(forecast.weather[0].main == "Haze"){
                iconUrl = "image/weather/haze.png";
            }
            else if(forecast.weather[0].main == "Dust" || data.weather[0].main == "Ash"){
                iconUrl = "image/weather/dustAsh.png";
            }
            else if(forecast.weather[0].main == "Fog"){
                iconUrl = "image/weather/fog.png";
            }
            else if(forecast.weather[0].main == "Sand"){
                iconUrl = "image/weather/sand.png";
            }
            else if(forecast.weather[0].main == "Tornado"){
                iconUrl = "image/weather/tornado.png";
            }

            forecastHour.innerHTML = `
                <p>${time}</p>
                <img src="${iconUrl}" alt="Weather icon">
                <p>${temp}</p>
            `;
            
            forecast3hRow.appendChild(forecastHour);
        });
    }

   // Fetch 5-day forecast data (limited to 6 days including the current day)
async function fetchForecast5Days(city) {
    const response = await fetch(forecastApiUrl + city + `&appid=${weatherApiKey}`);
    const data = await response.json();

    const chartLabels = [];
    const chartData = [];
    const forecastDays = {};

    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const label = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

        // Check if the date is already included
        if (!forecastDays[label]) {
            forecastDays[label] = forecast.main.temp; // Store the temperature for the date
        }
    });

    // Convert the forecastDays object to arrays and limit to 6 days
    Object.keys(forecastDays).slice(0, 6).forEach((label) => {
        chartLabels.push(label);
        chartData.push(forecastDays[label]);
    });

    const ctx = document.getElementById('weather-chart').getContext('2d');
    
    // Destroy the previous chart instance if it exists
    if (weatherChart) {
        weatherChart.destroy();
    }
    
    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Temperature (°C)',
                data: chartData,
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1,
                fill: false,
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 1)' // Change legend labels color to white
                    }
                }
            },
            scales: {
                x: {
                    grid:{
                        display: false
                    },
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    }
                },
                y: {
                    grid:{
                        display: false
                    },
                    beginAtZero: true,
                    ticks: {
                        color: 'white'
                    }
                }
            }
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
    function logUserInteraction(action) {
        const date = new Date();
        const logEntry = {
            date: date.toLocaleString(),
            action: action,
            page: getPageName()
        };

        let logs = JSON.parse(localStorage.getItem('userLogs')) || [];
        logs.push(logEntry);
        localStorage.setItem('userLogs', JSON.stringify(logs));
    }

    // Function to display user logs
    function displayUserLogs() {
        const logsTable = document.getElementById('logs-table');
        const logsBody = document.getElementById('logs-body');

        // Clear previous logs if any
        logsBody.innerHTML = '';

        // Retrieve logs from localStorage
        let logs = JSON.parse(localStorage.getItem('userLogs')) || [];

        // Display logs in the table
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.date}</td>
                <td>${log.action}</td>
                <td>${log.page}</td>
            `;
            logsBody.appendChild(row);
        });
    }

    // Function to reset logs
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function() {
        localStorage.removeItem('userLogs');
        displayUserLogs(); // Refresh logs display after reset
    });

    // Function to get the page name without file extension
    function getPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '').replace('index', 'Home').replace('weather', 'Weather').replace('news', 'News').replace('covid19', 'COVID-19').replace('logs', 'Logging');

        return page.charAt(0).toUpperCase() + page.slice(1);
    }
});