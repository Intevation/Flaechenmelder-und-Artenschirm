import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelderCluster = ref(undefined)
  const artenschirmOptions: Ref<Array<string>> = ref([])
  const artenFilters: Ref<Array<string>> = ref([])
  const artenschirmCluster = ref(undefined)
  const isPopupOpen = ref(false)
  const selectedFeature: Ref<any> = ref(undefined)
  const bundeslaender = ref([
    'Baden Würtemberg',
    'Bayern',
    'Berlin',
    'Brandenburg',
    'Bremen',
    'Hamburg',
    'Hessen',
    'Niedersachsen',
    'Mecklenburg-Vorpommern',
    'Nordrhein-Westfalen',
    'Rheinland-Pfalz',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Schleswig-Holstein',
    'Thüringen',
  ])
  const artenschirmBundeslandFilters = ref([])

  const applyFilters = () => {
    artenschirm.value?.eachLayer((layer) => {
      if (
        artenFilters.value.length > 0 &&
        layer.feature.geometry.properties.Arten &&
        !artenFilters.value.find((f) =>
          JSON.stringify(layer.feature.geometry.properties.Arten).includes(f),
        )
      ) {
        layer.remove()
      } else {
        if (map.value && !map.value.hasLayer(layer)) {
          layer.addTo(map.value)
        }
      }
    })
  }

  return {
    applyFilters,
    artenschirm,
    artenschirmBundeslandFilters,
    artenschirmCluster,
    artenschirmOptions,
    artenFilters,
    bundeslaender,
    flaechenmelder,
    flaechenmelderCluster,
    isPopupOpen,
    map,
    selectedFeature,
  }
})
