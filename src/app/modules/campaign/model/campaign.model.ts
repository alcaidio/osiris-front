import { CircleMarkerOptions, LatLng, LatLngBounds, PolylineOptions, TileLayerOptions } from 'leaflet'

export type ID = string | number
export type LangType = 'fr' | 'en'
export type GeomType = 'point' | 'linestring' | 'multilinestring' | 'multipolygon' | 'polygon'

export interface Campaign {
  id: ID
  title: string
  subtitle?: string
  thumbnail?: string
  creationDate?: Date
  lastUpdate?: Date
  // interventions?: Intervention[]
}

// export interface Intervention {
//   id: ID
//   name: string
//   type: 'survay' | 'works' | 'maintenance' | 'comptage' | 'other'
//   dateStart: Date
//   dateEnd: Date
// }

// ________________MAPS__________________________________________________________
export interface Map {
  id: ID
  config: Config
  overlays: Overlay[]
  baseLayers: BaseLayer[]
  calqueIds?: string[]
}

export interface MapSmall {
  id: ID
  config: Config
  title: string
  subtitle?: string
  overlayIds?: string[]
  baseLayerIds?: string[]
  calqueIds?: string[]
}

export interface Config {
  zoom: number
  center: LatLng // use latLng() from leaflet to convert [number, number]
  maxBounds: LatLngBounds
  layers: BaseLayer // "s" of layers because of leaflet
  minZoom?: number
  maxZoom?: number
  scrollWheelZoom?: boolean
  smoothWheelZoom?: boolean
  smoothSensitivity?: number
  tileSize?: number
  zoomOffset?: number
  boxZoom?: boolean
  zoomDelta?: number
  zoomSnap?: number
  zoomControl?: boolean
} // ____________________________________________________________________________________

// ________________OVERLAYS__________________________________________________________
export interface Overlay extends GeoJSON.FeatureCollection {
  id: ID
  layerName: string
  displayName: string
  visible?: boolean
  url: string
  username?: string
  password?: string
  overlayType: 'WFS' | 'WMS'
  featureType: string // ex: ROAD_SECTION
  featureTypeModel: TypeModel[]
  module: 'DIAG' | 'CARTO' | 'REF' | 'PICTURES' | 'AUTH'
  geomType: GeomType // ex: MultiLineString
  activeStyleSet: StyleSet[] // Two style set the Light and the Dark, don't forget to get one of them.
}

export interface GeoServerDTO {
  type: 'FeatureCollection'
  features: any
  numberMatched: number
  numberReturned: number
  timeStamp: number
  totalFeatures: number
  crs: {
    type: string
    properties: any
  }
}

export interface TypeModel {
  keyName: string
  displayName: string
  propertyType: 'number' | 'string' | 'date' | 'enum'
  propertyValues: PropertyValue[]
}

export interface PropertyValue {
  keyName: string
  displayName: string
  minValue?: number | null
  maxValue?: number | null
}

export interface StyleSet {
  keyName: string
  displayName: string
  type: 'LIGHT' | 'DARK'
  propertyType: 'number' | 'string' | 'date' | 'enum'
  rules: Rule[]
}

export interface Rule extends PolylineOptions, CircleMarkerOptions {
  keyName: string
  displayName: string
} // ____________________________________________________________________________________

// ________________BASELAYERS___________________________________________________________
export interface BaseLayer {
  id: ID
  name: string
  urlTemplate: string
  style: 'LIGHT' | 'DARK'
  token?: string | null
  thumbnail?: string | null
  options?: TileLayerOptions
} // ____________________________________________________________________________________

// ________________CALQUES_______________________________________________________________
export interface Calque {
  id: string
  overlayId?: ID
  layerName?: string
  displayName: string
  geomType: GeomType | null
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  properties: PropertyType[]
}

export interface PropertyType {
  // activeStyle: boolean // TODO : add this properties in the api
  displayName: string
  keyName: string
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  filterValues: PropertyValue[]
}

export interface PropertyValue {
  keyName: string
  displayName: string
  checked: boolean
  order: number
}

export interface FiltersProp {
  calqueName: string
  filters: string[]
} // ____________________________________________________________________________________

// ________________VIEWER_______________________________________________________________
export interface Picture {
  type?: string
  name: string
  path: string
  camera: CameraPositionType
  direction: number | null
}

// TEMP : because it's just a feature with properties
export interface PicturePoint {
  id: number
  geom: GeoJSON.Point
  pictures: Picture[]
  timestamp: number
  neighbours: { [id: string]: ID }
  // neighbours.id is type NeighboursDirectionType
}

export type CameraPositionType =
  | 'front'
  | 'back'
  | 'right'
  | 'left'
  | 'front-right'
  | 'front-left'
  | 'back-right'
  | 'back-left'

export type NeighboursDirectionType = 'front' | 'back' | 'front_right' | 'front_left' | 'back_right' | 'back_left'

export interface ViewParams {
  fov: number
  pitch: number
  yaw: number
  roll?: number
}

export interface CameraConfig {
  position: number[] | LatLng
  rotation: number
} // ____________________________________________________________________________________
