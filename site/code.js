const mapElement = document.querySelector('.map');

const control = {
  init() {
    this.initMap();
    this.loadMarkers();
  },
  initMap() {
    this.map = L.map('map').setView([20.0, 14.0], 3);
    
//     const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
//         attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
//     });
    
    var tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});
        
//     const tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//       attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//       maxZoom: 18,
//       id: 'mapbox/streets-v11',
//       tileSize: 512,
//       zoomOffset: -1,
//       accessToken: 'pk.eyJ1IjoiLXByb3RvbiIsImEiOiJja2hrazkwZDMxMWNlMnp2c3llcHJnZW82In0.3kdrrWF6VDl_D7pcbygwTw'
//     })
    
    tileLayer.addTo(this.map);

    this.mapMarkerIcon = L.icon({
//       iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: '/marker.png',
      // shadowUrl: 'leaf-shadow.png',
  
      iconSize:     [9, 9], // size of the icon
//       iconSize:     [12, 16], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
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
