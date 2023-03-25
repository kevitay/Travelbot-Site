let destination = localStorage.getItem("location");
const forecastHeading = document.querySelector("#forecast-heading");
const weatherSearchSection = document.querySelector("#weather-search");
const weatherSearchForm = document.querySelector("#weather-search-form");
const weatherError =  document.querySelector("#weathererror-message");
const userDirections = document.querySelector("#weatheruser-directions");
const weatherForecast =  document.querySelector("#weather-forecast");
const forecastListItems = document.querySelector("#daily-weather");

function removeChildNodes (parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const displayErrorComponents = function () {
  forecastHeading.classList.add("hidden");
  weatherSearchSection.classList.remove("hidden");
  userDirections.innerText = "Please enter a location";
  removeChildNodes(forecastListItems);
}

const getWeather = function (locale) {
  let data = fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locale}/next7days?key=L4U22KUSLGN3YLLFFS97G59BS&include=days&elements=datetime,tempmax,tempmin,precip,cloudcover,uvindex`
  )
    .then((data) => data.json())
    .catch(function (error) {
      console.log(error)
      displayErrorComponents();
    });

  return data;
};

const displayWeatherForecast = function (weatherData) {
  const searchResults = document.querySelector("#weather-forecast");

let destinationName = document.querySelector("#dest-name");
destinationName.innerText = destination;
    
  for (var i = 0; i < weatherData.days.length; i++) {

    let weatherForecastDay = document.createElement("div");
    weatherForecastDay.classList.add("weather-day");

    let date = document.createElement("p");
    if (i === 0) {
      date.innerText = `Today`;
    } else {
      date.innerText = `${(weatherData.days[i].datetime).substring(5)}`;
    }
    weatherForecastDay.appendChild(date);
    date.classList.add("weather-date");

    let high = document.createElement("p");
    high.innerText = `High: ${Math.round(weatherData.days[i].tempmax)}°`;
    weatherForecastDay.appendChild(high);
    high.classList.add("high-temp");

    let low = document.createElement("p");
    low.innerText = `Low: ${Math.round(weatherData.days[i].tempmin)}°`;
    weatherForecastDay.appendChild(low);
    low.classList.add("low-temp");

    let precipitation = document.createElement("p");
    precipitation.innerText = `Precipitation: ${Math.round(weatherData.days[i].precip)}%`;
    weatherForecastDay.appendChild(precipitation);

    let cloud = document.createElement("p");
    cloud.innerText = `Cloud Cover: ${Math.round(weatherData.days[i].cloudcover)}%`;
    weatherForecastDay.appendChild(cloud);

    let uv = document.createElement("p");
    uv.innerText = `UV Index: ${Math.round(weatherData.days[i].uvindex)}`;
    weatherForecastDay.appendChild(uv);

    searchResults.append(weatherForecastDay);
  }
}

if (destination === null) {
  displayErrorComponents();
  userDirections.innerText = "Please enter a location";

  weatherSearchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    let weatherSearchValue = document.querySelector("#weather-destination").value;
    
    localStorage.setItem("location", weatherSearchValue);
    destination = localStorage.getItem("location");

    weatherSearchSection.classList.add("hidden");
    forecastHeading.classList.remove("hidden");

    getWeather(destination).then(function (response) {
      displayWeatherForecast(response);
    });


  });

} else {
    getWeather(destination).then(function (response) {
      displayWeatherForecast(response);
    });
  }
