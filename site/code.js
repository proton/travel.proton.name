const mapElement = document.querySelector('.map')

const tileLayerUrls = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key={apikey}',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key={apikey}'
}

const tileLayerOptions = {
  attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19,
  apikey: window.TRAVEL_MAP_CONFIG?.cartoApiKey || ''
}

const control = {
  init() {
    this.initMap()
    this.loadMarkers()
  },
  initMap() {
    this.map = L.map('map', {
      zoomDelta: 1
    }).setView([20.0, 14.0], 3)

    this.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.setTileLayer()
    this.colorSchemeQuery.addEventListener('change', () => this.setTileLayer())

    this.mapMarkerIcon = L.icon({
      iconUrl: '/marker.png',

      iconSize:     [9, 9], // size of the icon
      popupAnchor:  [0, -9] // point from which the popup should open relative to the iconAnchor
  })

  },
  setTileLayer() {
    const theme = this.colorSchemeQuery.matches ? 'dark' : 'light'
    const tileLayerUrl = tileLayerUrls[theme]

    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer)
    }

    this.tileLayer = L.tileLayer(tileLayerUrl, tileLayerOptions)
    this.tileLayer.addTo(this.map)
  },
  loadMarkers() {
    fetch('/tripster_cities.json')
    .then(response => response.json())
    .then(cities => {
      const cityBounds = L.latLngBounds()

      for (const city of cities) {
        const position = this.addCityToMap(city)
        cityBounds.extend(position)
      }

      if (cityBounds.isValid()) {
        this.fitMapToCities(cityBounds)
      }
    })
    .catch(console.error)
  },
  fitMapToCities(cityBounds) {
    const originalZoomSnap = this.map.options.zoomSnap

    this.map.options.zoomSnap = 0.25
    this.map.fitBounds(cityBounds, {
      animate: false,
      padding: [20, 44]
    })
    this.map.options.zoomSnap = originalZoomSnap
  },
  addCityToMap(city) {
    const position = [city.y, city.x]
    const title = `${city.title_en} (${city.country_en})`

    const marker = L.marker(position, { icon: this.mapMarkerIcon }).addTo(this.map)
    marker.bindPopup(title)

    return position
  },
}

control.init()
