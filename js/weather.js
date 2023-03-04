let destination = localStorage.getItem('location');

// let destination = 'asdfkdjglkdfjgi';

const getWeather = function (location) {
  let data = fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next7days?key=L4U22KUSLGN3YLLFFS97G59BS&include=days&elements=datetime,tempmax,tempmin,precip,cloudcover,uvindex`
  )
    .then((data) => data.json())
    .catch(function (error) {
      console.log(error);
      let errorDisplay = document.createElement('p');
      errorDisplay.innerText = 'Sorry, Invalid destination';
      document.querySelector('#weather-forecast').append(errorDisplay);
    });

  return data;
};

getWeather(destination).then(function (response) {
  const searchResults = document.querySelector('#weather-forecast');

  for (var i = 0; i < response.days.length; i++) {
    var date = document.createElement('li');
    var high = document.createElement('p');
    high.classList.add('high-temp');
    var low = document.createElement('p');
    low.classList.add('low-temp');
    var precipitation = document.createElement('p');
    var cloud = document.createElement('p');
    var uv = document.createElement('p');
    var destinationName = document.querySelector('#dest-name');
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
