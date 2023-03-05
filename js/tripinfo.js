let mainPageSearch = localStorage.getItem('location');
let locationData;

const getLocationData = async function (search) {
  let response = await fetch(`https://api.opentripmap.com/0.1/en/places/geoname?name=${search}&apikey=5ae2e3f221c38a28845f05b68ceed8c701f04576cf1ba4710cff39a8`);
  let data = await response.json();
  return data;
};

const getPOI = async function (location) {
  // defined another api call here and locationData will be defined.

  let response = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=24140&lon=${location.lon}&lat=${location.lat}&format=json&limit=50&apikey=5ae2e3f221c38a28845f05b68ceed8c701f04576cf1ba4710cff39a8`
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
  const errorInfo = document.querySelector("#tripinfo-search");
  const poiHeading = document.querySelector("#poi-info h2");

  // If locationData.status = "NOT_FOUND"
    // Display the #tripinfo-search section
  if (locationData.status === "NOT_FOUND") {
    errorInfo.classList.remove("hidden");
    poiHeading.classList.add("hidden");
  }

  const poiData = await getPOI(locationData);
  console.log(locationData, poiData);

  const poiSearchResults = document.querySelector('#poi-list');

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

})();
