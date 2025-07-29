import type { CircleMarkerOptions } from 'leaflet'

type Art = {
  [key: string]: Array<string> | undefined
}

type GeojsonOptions = {
  initialFillColor: string
  hoverFillColor: string
  hoverMarkerRadius: number
  markerOptions: CircleMarkerOptions
}

type Geometry = {
  type: string
  coordinates: number[] | number[][][]
}

type ArtenschirmProperties = {
  NameProjekt: string
  Bundesweit: boolean
  Bundesland: string
  Landkreis: string
  projektziele: string[]
  ZieleSonstiges: string
  Arten: Art[]
  artensontiges: string
  Startjahr: string
  Endjahr: string
  Startjahr2: string
  PlanStartjahr: string
  Massnahmen: string
  Konkretes: string
  linkProjekt: string
  Fotos: string[]
  bestehendesProjekt?: boolean
}

type FlaechenmelderProperties = {
  Flaechenname: string
  Groesse: string
  areaSizeInHa?: string
  Website: string
  Fotos: string[]
  Bundesland: string
  Landkreis: string
  Lebensraumtypen: string[]
}

type SimpleFeature = {
  type: string
  geometries?: Geometry[]
  geometry?: Geometry
}

type Feature = {
  type: string
  geometries?: Geometry[]
  geometry?: Geometry
  properties: ArtenschirmProperties | FlaechenmelderProperties
}

interface ArtenschirmFeature extends SimpleFeature {
  properties: ArtenschirmProperties
}

interface FlaechenmelderFeature extends SimpleFeature {
  properties: FlaechenmelderProperties
}

type FeatureCollection = {
  type: string
  features: Feature[]
}

export type {
  Art,
  ArtenschirmFeature,
  ArtenschirmProperties,
  FlaechenmelderFeature,
  FlaechenmelderProperties,
  GeojsonOptions,
  Feature,
  FeatureCollection,
}

