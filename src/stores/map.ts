import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const artenschirmOptions: Ref<Array<string>> = ref([])
  const isPopupOpen = ref(false)
  const selectedFeature: Ref<any> = ref(undefined)

  return {
    artenschirm,
    artenschirmOptions,
    flaechenmelder,
    isPopupOpen,
    map,
    selectedFeature,
  }
})
