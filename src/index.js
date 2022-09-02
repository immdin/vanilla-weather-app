let now = new Date();
let date = document.querySelector("#data");
const opts = {
  weekday: "long",
  hour: "numeric",
  hour12: false,
  minute: "numeric",
};
let data = Intl.DateTimeFormat("en-US", opts).format(now);
date.innerHTML = `Last updated: ${data}`;

if (now.getHours() >= 16) {
  background.style.backgroundImage = 'url("src/styleLight.css")';
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
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
function showCurrentPlace(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey2 = "6c67fa383e767f87b00cfc48883a902d";
  let apiUrl2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey2}&units=metric`;
  axios.get(apiUrl2).then(showWeather);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCurrentPlace);
  celciuslink.classList.add("active");
  farengheitlink.classList.remove("active");
}

let placeButton = document.querySelector(".local");
placeButton.addEventListener("click", getCurrentPosition);

function showFarengheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciuslink.classList.remove("active");
  farengheitlink.classList.add("active");
  let f_temp = Math.round(celsiusTemperature * 1.8 + 32);
  temperatureElement.innerHTML = `${f_temp}°`;
  let feelsLike = document.querySelector(".feels");
  feelsLike.innerHTML = `Feels like ${Math.round(feelTemp * 1.8 + 32)}°F `;
}
let farengheitlink = document.querySelector(".farengheit");
farengheitlink.addEventListener("click", showFarengheitTemp);

function showCelciusTemp(event) {
  event.preventDefault();
  farengheitlink.classList.remove("active");
  celciuslink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
  let feelsLike = document.querySelector(".feels");
  feelsLike.innerHTML = `Feels like ${Math.round(feelTemp)}°C `;
}
let celsiusTemperature = null;
let feelTemp = null;

let searchButton = document.querySelector(".search");
searchButton.addEventListener("click", searchCity);
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", submitForm);

let celciuslink = document.querySelector(".celcius");
celciuslink.addEventListener("click", showCelciusTemp);

searchCity("Simferopol");
