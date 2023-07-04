const mapElement = document.querySelector('.map')

const control = {
  init() {
    this.initMap()
    this.loadMarkers()
  },
  initMap() {
    this.map = L.map('map').setView([20.0, 14.0], 3)

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
    })

    tileLayer.addTo(this.map)

    this.mapMarkerIcon = L.icon({
      iconUrl: '/marker.png',

      iconSize:     [9, 9], // size of the icon
      popupAnchor:  [0, -9] // point from which the popup should open relative to the iconAnchor
  })

  },
  loadMarkers() {
    fetch('/tripster_cities.json')
    .then(response => response.json())
    .then(cities => {
      for (const city of cities) {
        this.addCityToMap(city)
      }
    })
    .catch(console.error)
  },
  addCityToMap(city) {
    const position = [city.y, city.x]
    const title = `${city.title_en} (${city.country_en})`

    const marker = L.marker(position, { icon: this.mapMarkerIcon }).addTo(this.map)
    marker.bindPopup(title)
  },
}

control.init()
