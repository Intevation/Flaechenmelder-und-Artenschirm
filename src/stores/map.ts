import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'
import type { Ref } from 'vue'
import type { GeoJSON, Map } from 'leaflet'
import type { ArtenschirmProperties, FlaechenmelderProperties } from '@/types'

type ArtenschirmFilters = {
  arten: string[]
  bundeslaender: string[]
  geplant: boolean
  bestehend: boolean
  artenschirmArten: boolean
  andereArten: boolean
  [key: string]: string[] | boolean
}

type SizeFilter = {
  small: boolean
  medium: boolean
  big: boolean
}

type FlaechenmelderFilters = {
  lebensraumtypen: string[]
  size: SizeFilter
  [key: string]: string[] | boolean | SizeFilter
}

export const useMapStore = defineStore('geoData', () => {
  const map: Ref<Map | undefined> = ref(undefined)
  const artenschirm: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelder: Ref<GeoJSON | undefined> = ref(undefined)
  const flaechenmelderCluster = ref(undefined)
  const flaechenmelderFilters: Ref<FlaechenmelderFilters> = ref({
    lebensraumtypen: [],
    size: {
      small: true,
      medium: true,
      big: true,
    },
  })
  const flaechenmelderLebensraumTypenOptions: Ref<Array<string>> = ref([])
  const artenOptions: Ref<Array<string>> = ref([])
  const artenschirmFilters: Ref<ArtenschirmFilters> = ref({
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

  const fitsToArtenSelection = (properties: ArtenschirmProperties) => {
    const arten = artenschirmFilters.value.arten
    return (
      arten.length === 0 ||
      (properties.Arten && arten.find((f) => JSON.stringify(properties.Arten).includes(f)))
    )
  }

  const fitsToGeplantFilter = (properties: ArtenschirmProperties) => {
    return artenschirmFilters.value.geplant === true && properties.bestehendesProjekt === false
  }

  const fitsToBestehendFilter = (properties: ArtenschirmProperties) => {
    return artenschirmFilters.value.bestehend === true && properties.bestehendesProjekt === true
  }

  const fitsToArtenschirmArtenFilter = (properties: ArtenschirmProperties) => {
    return artenschirmFilters.value.artenschirmArten === true && properties.Arten?.length > 0
  }

  const fitsToAndereArtenFilter = (properties: ArtenschirmProperties) => {
    return artenschirmFilters.value.andereArten === true && properties.artensontiges?.length > 0
  }

  const fitsToBundeslandFilter = (properties: ArtenschirmProperties) => {
    return (
      artenschirmFilters.value.bundeslaender.length === 0 ||
      (properties.Bundesland?.length > 0 &&
        artenschirmFilters.value.bundeslaender.includes(properties.Bundesland))
    )
  }

  const fitsToLebensraumFilter = (properties: FlaechenmelderProperties) => {
    const lebensraumtypen = flaechenmelderFilters.value.lebensraumtypen
    return (
      lebensraumtypen.length === 0 ||
      (properties.Lebensraumtypen &&
        lebensraumtypen.find((t) => JSON.stringify(properties.Lebensraumtypen).includes(t)))
    )
  }

  const fitsToSizeFilter = (properties: FlaechenmelderProperties) => {
    const sizeString =
      properties.Groesse && properties.Groesse !== '' ? properties.Groesse : properties.areaSizeInHa
    if (sizeString === undefined) return false
    const filterSize = toRaw(flaechenmelderFilters.value.size)
    const size = Number(sizeString.replace(',', '.'))
    return (
      (size <= 10 && filterSize.small) ||
      (size >= 10 && size <= 50 && filterSize.medium) ||
      (size >= 50 && filterSize.big)
    )
  }

  const applyFilters = () => {
    artenschirm.value?.eachLayer((l) => {
      const layer = toRaw(l)
      const properties = layer.feature.geometry.properties ?? layer.feature.properties
      if (
        fitsToArtenSelection(properties) &&
        (fitsToGeplantFilter(properties) || fitsToBestehendFilter(properties)) &&
        (fitsToArtenschirmArtenFilter(properties) || fitsToAndereArtenFilter(properties)) &&
        fitsToBundeslandFilter(properties)
      ) {
        if (artenschirmCluster.value && !artenschirmCluster.value.hasLayer(layer)) {
          layer.addTo(toRaw(artenschirmCluster.value))
        }
      } else {
        layer.removeFrom(toRaw(artenschirmCluster.value))
      }
    })

    flaechenmelder.value?.eachLayer((l) => {
      const layer = toRaw(l)
      const properties = layer.feature.geometry.properties ?? layer.feature.properties
      if (fitsToLebensraumFilter(properties) && fitsToSizeFilter(properties)) {
        if (flaechenmelderCluster.value && !flaechenmelderCluster.value.hasLayer(layer)) {
          layer.addTo(toRaw(flaechenmelderCluster.value))
        }
      } else {
        layer.removeFrom(toRaw(flaechenmelderCluster.value))
      }
    })
  }

  const setArtenFilter = (key: string, value: string[] | boolean) => {
    artenschirmFilters.value[key] = value
  }

  const setFlaechenmelderFilter = (key: string, value: string[] | boolean | SizeFilter) => {
    flaechenmelderFilters.value[key] = value
  }

  return {
    applyFilters,
    artenschirm,
    artenschirmCluster,
    artenschirmFilters,
    artenOptions,
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
