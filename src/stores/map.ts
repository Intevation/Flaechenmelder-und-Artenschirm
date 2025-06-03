import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const isPopupOpen = ref(false)
  const selectedFeature: Ref<any> = ref(undefined)

  return {
    artenschirm,
    flaechenmelder,
    isPopupOpen,
    map,
    selectedFeature,
  }
})
