const mapElement = document.querySelector('.map');

const control = {
  init() {
    this.initMap();
    this.loadMarkers();
  },
  initMap() {
    this.map = L.map('map').setView([35.363, 35.044], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiLXByb3RvbiIsImEiOiJja2hrazkwZDMxMWNlMnp2c3llcHJnZW82In0.3kdrrWF6VDl_D7pcbygwTw'
    }).addTo(this.map);

    this.mapMarkerIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      // shadowUrl: 'leaf-shadow.png',
  
      iconSize:     [12, 16], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  
  },
  loadMarkers() {
    this.loadJSON('/tripster_cities.json', cities => {
      for (const city of cities) {
        if (!city.visited) continue;
        this.addCityToMap(city);
      }
    });
  },
  addCityToMap(city) {
    const position = [city.y, city.x];
    const title = `${city.title_en} (${city.country_en})`;

    const marker = L.marker(position, { icon: this.mapMarkerIcon }).addTo(this.map);
    marker.bindPopup(title);
  },
  // code from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
  loadJSON(url, callback) {
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
}

control.init();