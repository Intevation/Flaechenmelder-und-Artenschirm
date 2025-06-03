<script setup lang="ts">
import { CircleMarker, Control, GeoJSON, Map, TileLayer } from 'leaflet'
import { onMounted } from 'vue'
import { useMapStore } from '@/stores/map.ts'
import type { LayerGroup as LayerGroupType } from 'leaflet'
import Data from '../Geo-Daten/Engagement.json'

import '@leaflet/dist/leaflet.css'

const mapStore = useMapStore()

onMounted(() => {
  const map = new Map('map', {
    zoomControl: false,
  }).setView([51.505, 10.09], 6)
  mapStore.map = map
  new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  const zoomControl = new Control.Zoom({
    position: 'topright',
  })
  zoomControl.addTo(map)

  const createGeojsonForLeaflet = (data, options) => {
    return new GeoJSON(data, {
      onEachFeature: (feature, layer: LayerGroupType) => {
        layer.on('pointerover', () => {
          layer.eachLayer((l: any) => {
            if (l._latlng) {
              // Point
              l.setStyle({
                radius: options.hoverMarkerRadius,
              })
            } else if (l._latlngs) {
              // Polygon
              l.setStyle({
                fillColor: options.hoverFillColor,
              })
            }
          })
        })
        layer.on('pointerout', () => {
          layer.eachLayer((l: any) => {
            if (l._latlng) {
              // Point
              l.setStyle({
                radius: options.markerOptions.radius,
              })
            } else if (l._latlngs) {
              // Polygon
              l.setStyle({
                fillColor: options.initialFillColor,
              })
            }
          })
        })
        layer.on('click', () => {
          mapStore.selectedFeature = feature
          console.log('selected', feature)
        })
      },
      pointToLayer: (geoJsonPoint, latlng) => {
        return new CircleMarker(latlng, options.markerOptions)
      },
      fillColor: options.initialFillColor,
      color: '#991111',
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    })
  }

  const flaechenmelderOptions = {
    initialFillColor: '#99441520',
    hoverFillColor: '#99441560',
    hoverMarkerRadius: 10,
    markerOptions: {
      radius: 6,
      fillColor: '#e18432',
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    },
  }

  const flaechenmelderGeojson = createGeojsonForLeaflet(Data.Flaechenmelder, flaechenmelderOptions)
  flaechenmelderGeojson.addTo(map)
  mapStore.flaechenmelder = flaechenmelderGeojson

  const artenschirmOptions = {
    initialFillColor: '#99441520',
    hoverFillColor: '#99441560',
    hoverMarkerRadius: 10,
    markerOptions: {
      radius: 6,
      fillColor: '#051d2e',
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    },
  }

  const artenschirmGeojson = createGeojsonForLeaflet(Data.Artenschirm, artenschirmOptions)
  artenschirmGeojson.addTo(map)
  mapStore.artenschirm = artenschirmGeojson
})
</script>

<template>
  <main>
    <div id="map"></div>
  </main>
  <PopUp />
  <FilterSidebar />
</template>

<style scoped>
main {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}
</style>
