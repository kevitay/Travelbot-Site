let mainPageSearch = localStorage.getItem('location');
let locationData;
const errorInfoSection = document.querySelector("#tripinfo-search");
const errorMessage = document.querySelector("#triperror-message");
const userDirections = document.querySelector("#tripuser-directions");
const poiHeading = document.querySelector("#poi-info h2");

poiHeading.classList.add('hidden');

const getLocationData = async function (search) {
  let response = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${search}&apikey=5ae2e3f221c38a28845f05b6e5904e84a6415805d361e533e1ef2da0`);
  let data = await response.json();
  return data;
};

const getPOI = async function (location) {
  // defined another api call here and locationData will be defined.

  let response = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=24140&lon=${location.lon}&lat=${location.lat}&format=json&limit=50&apikey=5ae2e3f221c38a28845f05b6e5904e84a6415805d361e533e1ef2da0`
  );
  let data = await response.json();
  return data;
};

// Below is something called an IIFE -- Immediately Invoked Function
// Expression.  It is an anonymous function that gets invoked at the
// same time that it's defined (note the invokation parentheses on
// line 25.) .  Now instead of your whole application living inside
// a .then, it can live inside this IIFE instead and it looks...
// ...slightly easier to read...  But at least now we can say there
// is NO need for .then anywhere in this code anymore.
(async () => {

  locationData = await getLocationData(mainPageSearch);

  const displayPoiData = async function () {
    const poiData = await getPOI(locationData);
    console.log(locationData, poiData);
  
    const poiSearchResults = document.querySelector('#poi-list');

    poiHeading.classList.remove('hidden');
  
    for (var i = 0; i < poiData.length; i++) {
      if (poiData[i].name === '' || poiData[i].wikidata === undefined) {
        continue;
      } else {
        var poiName = document.createElement('li');
        var poiWikidata = document.createElement('a');
        var poiMaps = document.createElement('a');
        var destinationName = document.querySelector('#dest-name');
        destinationName.innerText = mainPageSearch;
        poiWikidata.href = `https://www.wikidata.org/wiki/${poiData[i].wikidata}`;
        poiWikidata.innerText = 'Wiki Link';
        poiMaps.href = `http://maps.google.com/maps?z=12&t=m&q=loc:${poiData[i].point.lat}+${poiData[i].point.lon}`;
        poiMaps.innerText = 'View Map';
        poiName.innerText = poiData[i].name;
        poiWikidata.append(poiMaps);
        poiName.append(poiWikidata);
        poiSearchResults.append(poiName);
      }
    }
  }

  // If mainPageSearch is null, or If locationData.status = "NOT_FOUND"
    // Display the #tripinfo-search section
  if (mainPageSearch === null || locationData.status === "NOT_FOUND") {

    if (mainPageSearch === null) {
      errorInfoSection.classList.remove("hidden");
      errorMessage.classList.add("hidden");
      userDirections.innerText = "Please enter a location";

    } else if (locationData.status === "NOT_FOUND") {
      errorMessage.classList.remove("hidden");
      errorMessage.innerText = "Sorry, invalid input";
      userDirections.innerText = "Please enter a valid location";
      errorInfoSection.classList.remove("hidden");
    }

  } else {

    displayPoiData();

  }

  if (!(errorInfoSection.classList.contains("hidden"))) {
    let tripPageSearch = document.querySelector("#tripinfo-search-form");

    tripPageSearch.addEventListener("submit", function(e) {
      e.preventDefault();

      let destination = document.querySelector("#tripinfo-destination").value;
      localStorage.setItem('location', destination);
      mainPageSearch = localStorage.getItem('location');

      errorInfoSection.classList.add("hidden");

      getLocationData(mainPageSearch);
      displayPoiData();

      window.location.reload();

    });


  }

})();
