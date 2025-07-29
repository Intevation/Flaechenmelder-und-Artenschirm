<script setup lang="ts">
import { onMounted, toRaw, watch } from 'vue'
import { useMapStore } from '@/stores/map.ts'
import type { LayerGroup as LayerGroupType } from 'leaflet'
import type {
  Art,
  ArtenschirmFeature,
  FlaechenmelderFeature,
  Feature,
  FeatureCollection,
  GeojsonOptions,
} from './types.ts'
import Data from '../Geo-Daten/Engagement.json'
import L from 'leaflet'
import 'leaflet.markercluster'
import { area } from '@turf/area'

import '@leaflet/dist/leaflet.css'

const mapStore = useMapStore()

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

watch(
  mapStore.artenschirmFilters,
  () => {
    mapStore.applyFilters()
  },
  { deep: true },
)

watch(
  mapStore.flaechenmelderFilters,
  () => {
    mapStore.applyFilters()
  },
  { deep: true },
)

// Create Geojson object from the exported data
const createGeojsonForLeaflet = (allData: FeatureCollection, options: GeojsonOptions) => {
  // Ignore features without valid geometry data
  const sanitizedData = structuredClone(allData)['features'].filter((f) => {
    return (f.geometries?.length && f.geometries.length > 0) || f.geometry
  })
  return L.geoJSON(sanitizedData, {
    onEachFeature: (feature: Feature, layer: LayerGroupType) => {
      const isSinglePoint = feature.geometries == undefined
      layer.on('mouseover', () => {
        if (isSinglePoint) {
          layer.setStyle({
            radius: options.hoverMarkerRadius,
          })
        } else {
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
        }
      })
      layer.on('mouseout', () => {
        if (isSinglePoint) {
          layer.setStyle({
            radius: options.markerOptions.radius,
          })
        } else {
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
        }
      })
      layer.on('click', () => {
        if (isSinglePoint) {
          toRaw(mapStore.map).flyTo(layer._latlng, 10)
        } else {
          toRaw(mapStore.map).flyToBounds(layer.getBounds(), {
            duration: 2,
          })
        }
        mapStore.selectedFeature = feature
      })
    },
    pointToLayer: (geoJsonPoint, latlng) => {
      const marker = L.circleMarker(latlng, options.markerOptions)
      marker.feature = structuredClone(geoJsonPoint)
      return marker
    },
    fillColor: options.initialFillColor,
    color: '#991111',
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
  })
}

const createClusterGroup = (className: string) => {
  const clusterGroup = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount()
      const width = 14 + `${count}`.length * 3
      return L.divIcon({
        className: `${className} cluster-div-icon`,
        html: '<b>' + count + '</b>',
        iconSize: L.point(width, width),
      })
    },
    maxClusterRadius: 20,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: false,
  })
  clusterGroup.on('clusterclick', (e) => {
    const map = toRaw(mapStore.map)
    const children = e.layer.getAllChildMarkers()
    if (map && map.getZoom() === map.getMaxZoom()) {
      const container = document.createElement('div')
      container.classList.add('popup-container')
      children.forEach((c) => {
        const button = document.createElement('button')
        button.textContent = c.feature.properties.NameProjekt || c.feature.properties.Flaechenname
        button.addEventListener('click', () => {
          mapStore.selectedFeature = c.feature
        })
        container.appendChild(button)
      })

      const popup = L.popup()
      popup.setLatLng(e.latlng)
      popup.setContent(container)
      popup.openOn(map)
    }
  })
  return clusterGroup
}

const addFlaechenmelderData = () => {
  const lebensraumTypen: string[] = []
  Data.Flaechenmelder.features.forEach((f: FlaechenmelderFeature) => {
    // Collect Lebensraumtypen to show them as options in dropdown
    structuredClone(f).properties.Lebensraumtypen.forEach((t) => {
      if (!lebensraumTypen.includes(t)) {
        lebensraumTypen.push(t)
      }
    })

    // Add size (in ha) to features
    const polygon = f.geometries?.find((g) => g.type === 'Polygon')
    if (polygon) {
      if (f.properties.Groesse) {
        f.properties.Groesse = f.properties.Groesse.replace(',', '.')
      } else {
        f.properties.areaSizeInHa = `${area(polygon) / 10000}`
      }
    }
  })
  mapStore.flaechenmelderLebensraumTypenOptions = lebensraumTypen

  const flaechenmelderGeojson = createGeojsonForLeaflet(Data.Flaechenmelder, flaechenmelderOptions)
  const flaechenmelderClusterGroup = createClusterGroup('flaechenmelder')
  flaechenmelderClusterGroup.addLayer(flaechenmelderGeojson)
  toRaw(mapStore.map).addLayer(flaechenmelderClusterGroup)
  mapStore.flaechenmelderCluster = flaechenmelderClusterGroup
  mapStore.flaechenmelder = flaechenmelderGeojson
}

onMounted(() => {
  const map = L.map('map', {
    zoomControl: false,
  }).setView([51.505, 10.09], 6)
  mapStore.map = map
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  const zoomControl = L.control.zoom({
    position: 'topright',
  })
  zoomControl.addTo(map)

  if (Data.Flaechenmelder) {
    addFlaechenmelderData()
  }

  // Create one single array with all Arten as strings
  const artenOptions: Array<string> = []
  Data.Artenschirm.features.forEach((f: ArtenschirmFeature) => {
    f.properties.Arten.forEach((art: Art) => {
      const artKey: string = Object.keys(art)[0]
      if (art[artKey]) {
        const artEntries: Array<string> = art[artKey]
        artEntries.forEach((entry) => {
          if (!artenOptions.includes(entry)) {
            artenOptions.push(entry)
          }
        })
      }
    })
  })
  mapStore.artenOptions = artenOptions

  const artenschirmGeojson = createGeojsonForLeaflet(Data.Artenschirm, artenschirmOptions)
  const artenschirmClusterGroup = createClusterGroup('artenschirm')
  artenschirmClusterGroup.addLayer(artenschirmGeojson)
  map.addLayer(artenschirmClusterGroup)
  mapStore.artenschirmCluster = artenschirmClusterGroup
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

<style global>
main {
  height: 100vh;
  width: 100%;
}

#map {
  height: 100%;
  width: 100%;
}

.cluster-div-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1pt white solid;
  border-radius: 50%;
  color: white;
}

.artenschirm.cluster-div-icon {
  background-color: #051d2e;
}

.flaechenmelder.cluster-div-icon {
  background-color: #e18432;
}

.popup-container {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-container button {
  min-width: fit-content;
  width: 100%;
  height: max-content;
  text-align: left;
  border: none;
}

.popup-container button:not(:last-child) {
  border-bottom: 1pt solid #bbb;
}
</style>
