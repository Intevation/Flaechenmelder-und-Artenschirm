import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const artenschirmOptions: Ref<Array<string>> = ref([])
  const artenFilters: Ref<Array<string>> = ref([])
  const isPopupOpen = ref(false)
  const selectedFeature: Ref<any> = ref(undefined)

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
    artenschirmOptions,
    artenFilters,
    flaechenmelder,
    isPopupOpen,
    map,
    selectedFeature,
  }
})
