const mapElement = document.querySelector('.map');

const control = {
  init() {
    this.initMap();
    this.loadMarkers();
  },
  initMap() {
    this.map = L.map('map').setView([20.0, 14.0], 3);
    
    var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
    });
        
    tileLayer.addTo(this.map);

    this.mapMarkerIcon = L.icon({
      iconUrl: '/marker.png',
  
      iconSize:     [9, 9], // size of the icon
      popupAnchor:  [0, -9] // point from which the popup should open relative to the iconAnchor
  });
  
  },
  loadMarkers() {
    this.loadJSON('/tripster_cities.json', cities => {
      for (const city of cities) {
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
