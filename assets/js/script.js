// ****** Key and Elements ******
const APIKey = "9f776f17932acae3940eefa178872e8c";
let forecastCount;
let weatherIcon;
let longitude, latitude;
let cityHistory = [];
const searchBtn = $(".btn");
const clearBtn = $(".clear-btn");
let searchHistory = $("#search-history");
let currentCity = $(".current-city");
let currentDate = $(".current-date");
let currentTemp = $(".current-temp");
let currentWind = $(".current-wind");
let currentHumidity = $(".current-humidity");

let currentMonth, currentDay, currentYear, fullDate, unixDate, convertedDate, currentTime;

// Function to generate Date
function convertUnix(unixDate) {
    currentTime = new Date();
    convertedDate = new Date(unixDate*1000 + currentTime.getTimezoneOffset() * 60 * 1000);
    currentMonth = convertedDate.getMonth() + 1;
    currentDay = convertedDate.getDate();
    currentYear = convertedDate.getFullYear();
    fullDate = `${currentMonth}/${currentDay}/${currentYear}`
    return fullDate;
};

// Sets a default city on page load
function init() {
    var historyTemp = localStorage.getItem("cityHistory");
    if(historyTemp){
        cityHistory = JSON.parse(historyTemp);
    }
    createHistoryButtons();
    var searchTemp = localStorage.getItem("entered");
    if(searchTemp){
        getCurrentWeather(searchTemp);
    } else {
        citySearch = "Philadelphia"
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIKey + "&units=imperial";
        getCurrentWeather(queryURL);
    }
};

init();

// Fetches weather data from API
function getCurrentWeather(queryURL) {
    localStorage.setItem("entered", queryURL);
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
        fiveDayForecast(latitude, longitude);
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
    createHistoryButtons();
});

// Creates search history, prevents duplicate searches
function createHistoryButtons() {
    searchHistory.empty();
    let addedValues = [];

    for (let i = 0; i < cityHistory.length; i++) {
        let cityName = cityHistory[i];
        if (!addedValues.includes(cityName)) {
            let historyBtn = $("<button>");
            historyBtn.text(cityName);
            historyBtn.val(cityName);
            historyBtn.attr("class", "history-btn");
            searchHistory.append(historyBtn);
            
            addedValues.push(cityName);
        }
    }
}

// Allows search history buttons to function
searchHistory.on("click", ".history-btn", function() {
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).val() + "&appid=" + APIKey + "&units=imperial";
    getCurrentWeather(queryURL);
})

// Clears history
clearBtn.on("click", function() {
    searchHistory.empty();
    cityHistory= [];
    localStorage.clear;
});

// Fetches fron API for the next 5 days
function fiveDayForecast(lat, lon) {
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat +"&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL).then(function (response) {
        return response.json();
    }).then(function (data) {
        forecastCount = 0;
        for (let i = 0; i < 5; i++) {
            let fiveDays = $(`#day${i}`);
            weatherIcon = data.list[forecastCount].weather[0].icon;
            unixDate = data.list[forecastCount].dt;
            fiveDays.children(".date").text(convertUnix(unixDate));
            fiveDays.children().attr("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`);
            fiveDays.children().children(".temp").text(data.list[forecastCount].main.temp);
            fiveDays.children().children(".wind").text(data.list[forecastCount].wind.speed);
            fiveDays.children().children(".humidity").text(data.list[forecastCount].main.humidity);
            forecastCount = forecastCount + 8;
        }
    });
}