// code from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
function loadJSON(url, callback) {
  let xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', url, true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(JSON.parse(xobj.responseText));
    }
  };
  xobj.send(null);  
}

function addCityToMap(city, map) {
  const position = {lat: city.y, lng: city.x};
  const title = `${city.title_en} (${city.country_en})`;

  const marker = new google.maps.Marker({
    position: position,
    map: map,
    title: title
  });

  google.maps.event.addListener(marker, 'click', function(){
    const infowindow = new google.maps.InfoWindow({
      content: title,
      position: position,
    });
    infowindow.open(map);
  });
}

function initMap() {
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 3,
    center: {lat: 38.363, lng: 39.044}
  });

  loadJSON('/tripster_cities.json', function(data) {
    for (const city of data.cities) {
      if (!city.visited) continue;
      addCityToMap(city, map);
    }
  });
}