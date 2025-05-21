<script setup lang="ts">
import { Control, Map, TileLayer } from 'leaflet'
import { onMounted } from 'vue'
import '@leaflet/dist/leaflet.css'

onMounted(() => {
  const map = new Map('map', {
    zoomControl: false,
  }).setView([51.505, 10.09], 6)
  new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  const zoomControl = new Control.Zoom({
    position: 'bottomright',
  })
  zoomControl.addTo(map)
})
</script>

<template>
  <main>
    <div id="map"></div>
  </main>
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
