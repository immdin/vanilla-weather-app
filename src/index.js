let coords = null;
let timezone;
let timezoneMinutes;
let tempMax = document.querySelector(".temp-max");
let tempMin = document.querySelector(".temp-min");

function formatDate(timezone, timezoneMinutes) {
  let now = new Date();

  now.setHours(now.getUTCHours() + timezone);
  now.setMinutes(now.getUTCMinutes() + timezoneMinutes);
  let hour = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "Fabruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let currentDate = now.getDate();

  document.querySelector(
    "#data"
  ).innerHTML = `${month} ${currentDate} <br/> ${day} | ${hour}:${minutes}`;
}

// forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let forecastDay = date.getDate();
  let forecastMonth = date.getMonth() + 1;

  if (forecastDay.toString().length < 2) {
    forecastDay = `0${forecastDay}`;
  }

  if (forecastMonth.toString().length < 2) {
    forecastMonth = `0${forecastMonth}`;
  }

  let formattedForecastDate = `${forecastDay}.${forecastMonth}`;
  return formattedForecastDate;
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    maxTemp = Math.round(forecastDay.temp.max);
    minTemp = Math.round(forecastDay.temp.min);

    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
          <div class="week_day">${formatDay(forecastDay.dt)}</div>
          <div class="forecast_date">${formatForecastDate(forecastDay.dt)}</div>
          <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt="" 
          class="f-icon"
          />
          <div class="forecast-temperatures">
            <span class="temp-max">${maxTemp}</span><span class="degree-symbol">°</span> <br />
            <span class="temp-min">${minTemp}</span>
            <span class="degree-symbol">°</span>
          </div>
        </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c95d60a1e3adbeb286133f1ebebc2579";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;

  let temperatureElement = document.querySelector("#temperature");
  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;

  let sky = document.querySelector(".description");
  sky.innerHTML = response.data.weather[0].description;

  let feelsLike = document.querySelector(".feels");
  feelTemp = response.data.main.feels_like;
  feelsLike.innerHTML = `Feels like ${Math.round(feelTemp)}°`;
  let humidity = document.querySelector(".humidity");
  humidity.innerHTML = ` ${response.data.main.humidity}%`;
  let wind = document.querySelector(".wind");
  wind.innerHTML = ` ${Math.round(response.data.wind.speed)}km/h`;
  let pressure = document.querySelector(".pressure");
  pressure.innerHTML = ` ${Math.round(response.data.main.pressure)}mb`;
  timezone = response.data.timezone / 3600;
  timezoneMinutes = (response.data.timezone % 3600) / 60;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  coords = response.data.coord;
  getForecast(coords, "metric");
}

function searchCity(cityName) {
  let apiKey = "6c67fa383e767f87b00cfc48883a902d";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function submitForm(event) {
  event.preventDefault();
  let cityName = document.querySelector("#text-input").value;
  searchCity(cityName);
  if (cityName) {
    searchCity(cityName);
  } else {
    alert(`Please enter a city`);
  }
}

setInterval(function () {
  formatDate(timezone, timezoneMinutes);
}, 1000);

function showCurrentPlace(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey2 = "6c67fa383e767f87b00cfc48883a902d";
  let apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey2}&units=metric`;
  axios.get(apiUrl2).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCurrentPlace);
}

let placeButton = document.querySelector(".local");
placeButton.addEventListener("click", getCurrentPosition);

let searchButton = document.querySelector(".search");
searchButton.addEventListener("click", searchCity);
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitForm);

searchCity("Simferopol");
