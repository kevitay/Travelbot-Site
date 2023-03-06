let destination = localStorage.getItem("location");
const forecastHeading = document.querySelector("#forecast-heading");
const weatherSearchSection = document.querySelector("#weather-search");
const weatherSearchForm = document.querySelector("#weather-search-form");
const weatherError =  document.querySelector("#weathererror-message");
const userDirections = document.querySelector("#weatheruser-directions")
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
    
  for (var i = 0; i < weatherData.days.length; i++) {
    var date = document.createElement("li");
    var high = document.createElement("p");
    high.classList.add("high-temp");
    var low = document.createElement("p");
    low.classList.add("low-temp");
    var precipitation = document.createElement("p");
    var cloud = document.createElement("p");
    var uv = document.createElement("p");
    var destinationName = document.querySelector("#dest-name");
    destinationName.innerText = destination;
    date.innerText = `Date: ${weatherData.days[i].datetime}`;
    high.innerText = `High: ${Math.round(weatherData.days[i].tempmax)}°`;
    low.innerText = `Low: ${Math.round(weatherData.days[i].tempmin)}°`;
    precipitation.innerText = `Precipitation: ${Math.round(weatherData.days[i].precip)}%`;
    cloud.innerText = `Cloud Cover: ${Math.round(weatherData.days[i].cloudcover)}%`;
    uv.innerText = `UV Index: ${Math.round(weatherData.days[i].uvindex)}`;
    date.append(high);
    date.append(low);
    date.append(precipitation);
    date.append(cloud);
    date.append(uv);
    searchResults.append(date);
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

    getWeather(destination).then(function (response) {
      displayWeatherForecast(response);
    });


  });

} else {
    getWeather(destination).then(function (response) {
      displayWeatherForecast(response);
    });
  }
