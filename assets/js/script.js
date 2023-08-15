// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// ****** Key and Elements ******
const APIKey = "9f776f17932acae3940eefa178872e8c";
let forecastCount;
let weatherIcon;
let longitude, latitude;
let cityHistory = [];

const searchBtn = $(".btn");
const clearBtn = $(".clear-btn");
let searchHistory = $(".search-history");
let currentCity = $(".current-city");
let currentDate = $(".current-date");
let currentTemp = $(".current-temp");
let currentWind = $(".current-wind");
let currentHumidity = $(".current-humidity");

let currentMonth, currentDay, currentYear, fullDate, unixDate, convertedDate, currentTime;


function convertUnix(unixDate) {
    currentTime = new Date();
    convertedDate = new Date(unixDate*1000 + currentTime.getTimezoneOffset() * 60 * 1000);
    currentMonth = convertedDate.getMonth() + 1;
    currentDay = convertedDate.getDate();
    currentYear = convertedDate.getFullYear();
    fullDate = `${currentMonth}/${currentDay}/${currentYear}`
    return fullDate;
};

function init() {
    var historyTemp = localStorage.getItem("cityHistory");
    if(historyTemp){
        cityHistory = JSON.parse(historyTemp);
    }
    var searchTemp = localStorage.getItem("search");
    if(searchTemp){
        getCurrentWeather(searchTemp);
    } else {
        citySearch = "Philadelphia"
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIKey + "&units=imperial";
        getCurrentWeather(queryURL);
    }
};

init();

function getCurrentWeather(queryURL) {
    localStorage.setItem("search", queryURL);
    fetch(queryURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        weatherIcon = data.weather[0].icon;
        unixDate = data.dt;
        currentCity.text(data.name);
        $(".city-and-date").children(".icon").attr("src"), `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        currentDate.text(convertUnix(unixDate));
        currentTemp.text(data.main.temp);
        currentWind.text(data.wind.speed);
        currentHumidity.text(data.main.humidity);
    });
};

searchBtn.on("click", function() {
    let userCity = $("#enter-city");
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userCity.val() + "&appid=" + APIKey + "&units=imperial";
    cityToSearch = userCity.val();
    if (userCity.val() !== "") {
        getCurrentWeather(queryURL);
    }
    cityHistory.push(cityToSearch);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
});