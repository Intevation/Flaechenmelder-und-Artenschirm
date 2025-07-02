import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelderCluster = ref(undefined)
  const flaechenmelderFilters = ref({
    lebensraumtypen: [],
    size: {
      small: true,
      medium: true,
      big: true,
    },
  })
  const flaechenmelderLebensraumTypenOptions: Ref<Array<string>> = ref([])
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
    'Brandenburg & Berlin',
    'Hessen',
    'Niedersachsen & Bremen',
    'Mecklenburg-Vorpommern',
    'Nordrhein-Westfalen',
    'Rheinland-Pfalz',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Schleswig-Holstein & Hamburg',
    'Thüringen',
  ])

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

  const fitsToBundeslandFilter = (properties) => {
    return (
      artenschirmFilters.value.bundeslaender.length === 0 ||
      (properties.Bundesland &&
        artenschirmFilters.value.bundeslaender.includes(properties.Bundesland))
    )
  }

  const fitsToLebensraumFilter = (properties) => {
    const lebensraumtypen = flaechenmelderFilters.value.lebensraumtypen
    return (
      lebensraumtypen.length === 0 ||
      (properties.Lebensraumtypen &&
        lebensraumtypen.find((t) => JSON.stringify(properties.Lebensraumtypen).includes(t)))
    )
  }

  const fitsToSizeFilter = (properties) => {
    const size =
      properties.Groesse && properties.Groesse !== '' ? properties.Groesse : properties.areaSizeInHa
    const filterSize = flaechenmelderFilters.value.size
    return (
      (size < 10 && filterSize.small) ||
      (size > 10 && size < 50 && filterSize.medium) ||
      (size > 50 && filterSize.big)
    )
  }

  const applyFilters = () => {
    artenschirm.value?.eachLayer((layer) => {
      const properties = layer.feature.geometry.properties
      if (
        fitsToArtenFilter(properties) &&
        fitsToGeplantFilter(properties) &&
        fitsToBestehendFilter(properties) &&
        fitsToArtenschirmArtenFilter(properties) &&
        fitsToAndereArtenFilter(properties) &&
        fitsToBundeslandFilter(properties)
      ) {
        if (artenschirmCluster.value && !artenschirmCluster.value.hasLayer(layer)) {
          layer.addTo(artenschirmCluster.value)
        }
      } else {
        layer.removeFrom(artenschirmCluster.value)
      }
    })

    flaechenmelder.value?.eachLayer((layer) => {
      const properties = layer.feature.geometry.properties
      if (fitsToLebensraumFilter(properties) && fitsToSizeFilter(properties)) {
        if (flaechenmelderCluster.value && !flaechenmelderCluster.value.hasLayer(layer)) {
          layer.addTo(flaechenmelderCluster.value)
        }
      } else {
        layer.removeFrom(flaechenmelderCluster.value)
      }
    })
  }

  const setArtenFilter = (key: string, value) => {
    artenschirmFilters.value[key] = value
  }

  const setFlaechenmelderFilter = (key: string, value) => {
    flaechenmelderFilters.value[key] = value
  }

  return {
    applyFilters,
    artenschirm,
    artenschirmCluster,
    artenschirmFilters,
    artenschirmOptions,
    bundeslaender,
    flaechenmelder,
    flaechenmelderCluster,
    flaechenmelderFilters,
    flaechenmelderLebensraumTypenOptions,
    isPopupOpen,
    map,
    selectedFeature,
    setArtenFilter,
    setFlaechenmelderFilter,
  }
})
