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
  const artenschirmFilters = ref({
    arten: [],
    bundeslaender: [],
    geplant: true,
    bestehend: true,
    artenschirmArten: true,
    andereArten: true,
  })
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

  const fitsToArtenFilter = (properties) => {
    const arten = artenschirmFilters.value.arten
    return (
      arten.length === 0 ||
      (properties.Arten && arten.find((f) => JSON.stringify(properties.Arten).includes(f)))
    )
  }

  const fitsToGeplantFilter = (properties) => {
    return artenschirmFilters.value.geplant === true || properties.bestehendesProjekt === false
  }

  const fitsToBestehendFilter = (properties) => {
    return artenschirmFilters.value.bestehend === true || properties.bestehendesProjekt === true
  }

  const fitsToArtenschirmArtenFilter = (properties) => {
    return artenschirmFilters.value.artenschirmArten === true || properties.Arten?.length > 0
  }

  const fitsToAndereArtenFilter = (properties) => {
    return artenschirmFilters.value.andereArten === true || properties.artensontiges?.length > 0
  }

  const applyFilters = () => {
    artenschirm.value?.eachLayer((layer) => {
      const properties = layer.feature.geometry.properties
      if (
        fitsToArtenFilter(properties) &&
        fitsToGeplantFilter(properties) &&
        fitsToBestehendFilter(properties) &&
        fitsToArtenschirmArtenFilter(properties) &&
        fitsToAndereArtenFilter(properties)
      ) {
        if (artenschirmCluster.value && !artenschirmCluster.value.hasLayer(layer)) {
          layer.addTo(artenschirmCluster.value)
        }
      } else {
        layer.removeFrom(artenschirmCluster.value)
      }
    })
  }

  const setArtenFilter = (key: string, value) => {
    artenschirmFilters.value[key] = value
  }

  return {
    applyFilters,
    artenschirm,
    artenschirmBundeslandFilters,
    artenschirmCluster,
    artenschirmFilters,
    artenschirmOptions,
    bundeslaender,
    flaechenmelder,
    flaechenmelderCluster,
    isPopupOpen,
    map,
    selectedFeature,
    setArtenFilter,
  }
})
