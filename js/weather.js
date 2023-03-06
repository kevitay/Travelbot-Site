let destination = localStorage.getItem("location");
const forecastHeading = document.querySelector("#forecast-heading");
const weatherSearch = document.querySelector("#weather-search");
const weatherError =  document.querySelector("#weathererror-message");
const weatherForecast =  document.querySelector("#weather-forecast");
const forecastListItems = document.querySelector("#daily-weather");

function removeChildNodes (parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

const displayErrorComponents = function () {
  forecastHeading.classList.add("hidden");
  weatherSearch.classList.remove("hidden");
  weatherError.innerText = "Sorry, invalid input";
  removeChildNodes(forecastListItems);
}

const getWeather = function (locale) {
  let data = fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locale}/next7days?key=L4U22KUSLGN3YLLFFS97G59BS&include=days&elements=datetime,tempmax,tempmin,precip,cloudcover,uvindex`
  )
    .then((data) => data.json())
    .catch(function (error) {
      console.log(error);
      displayErrorComponents();
      weatherError.innerText = "Sorry, location not found"
      weatherError.classList.remove("hidden")
      
    });

  return data;
};

if (destination === null) {
  displayErrorComponents();
} else {
    getWeather(destination).then(function (response) {
      const searchResults = document.querySelector("#weather-forecast");
    
      for (var i = 0; i < response.days.length; i++) {
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
        date.innerText = `Date: ${response.days[i].datetime}`;
        high.innerText = `High: ${Math.round(response.days[i].tempmax)}°`;
        low.innerText = `Low: ${Math.round(response.days[i].tempmin)}°`;
        precipitation.innerText = `Precipitation: ${Math.round(response.days[i].precip)}%`;
        cloud.innerText = `Cloud Cover: ${Math.round(response.days[i].cloudcover)}%`;
        uv.innerText = `UV Index: ${Math.round(response.days[i].uvindex)}`;
        date.append(high);
        date.append(low);
        date.append(precipitation);
        date.append(cloud);
        date.append(uv);
        searchResults.append(date);
      }
    });
  }
