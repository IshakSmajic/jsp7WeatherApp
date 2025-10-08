document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    const apiKey = '592d57de2c791f296d809ac5a25743cf';

    if (!city) {
        document.getElementById('weatherResult').innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(geoData => {
            if (geoData.length === 0) {
                document.getElementById('weatherResult').innerHTML = '<p>City not found.</p>';
                return;
            }

            const { lat, lon } = geoData[0];

            
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(forecastData => {
            if (!forecastData || !forecastData.list) {
                document.getElementById('weatherResult').innerHTML = '<p>Error retrieving forecast data.</p>';
                return;
            }

            
            const grouped = {};
            forecastData.list.forEach(entry => {
                const date = new Date(entry.dt_txt).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(entry);
            });

            
            const summaries = Object.entries(grouped).map(([date, items]) => {
                const temps = items.map(i => i.main.temp);
                const min = Math.min(...temps);
                const max = Math.max(...temps);
                const sample = items[Math.floor(items.length / 2)];
                const desc = sample.weather[0].description;
                const icon = sample.weather[0].icon;
                return { date, min, max, desc, icon };
            });

            
            const forecastHTML = summaries.map(day => `
                <div class="forecast-card">
                    <h3>${day.date}</h3>
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.desc}">
                    <p>${day.desc}</p>
                    <p>${Math.round(day.min)}°C / ${Math.round(day.max)}°C</p>
                </div>
            `).join('');

            document.getElementById('weatherResult').innerHTML = `
                <h2>5-Day Forecast for ${city}</h2>
                <div class="forecast-container">${forecastHTML}</div>
            `;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('weatherResult').innerHTML = '<p>Unable to retrieve weather data.</p>';
        });
});
