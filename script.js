//this is the API key: 592d57de2c791f296d809ac5a25743cf
(fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=592d57de2c791f296d809ac5a25743cf&units=metric'))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));