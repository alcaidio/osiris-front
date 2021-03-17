import { CircleMarkerOptions, LatLng, LatLngBounds, MapOptions, PolylineOptions, TileLayerOptions } from 'leaflet'

export type ID = string | number

export interface Campaign {
  id: ID
  title: string
  subtitle?: string
  thumbnail?: string
  creationDate?: number
  lastUpdate?: number
  mapId?: string
  interventions?: Intervention[]
}

export interface Intervention {
  id: ID
  name: string
  type: 'survay' | 'works' | 'maintenance' | 'comptage' | 'other'
  dateStart: Date
  dateEnd: Date
}

export enum ColorState {
  VERY_GOOD = '#00FF00',
  GOOD = '#FFFF00',
  MEDIUM = '#FFA500',
  BAD = '#FF0000',
  VERY_BAD = '#000000',
}

export enum FeatureProperties {
  SECTION = 'section',
  IMAGE = 'image',
  IMAGE360 = 'image360',
  // TODO : Complete this section
}

export interface MapSmall {
  id: ID
  config: Config
  // overlayIds?: string[]
  // baseLayerIds?: string[]
  // calqueIds?: string[]
}

export interface Map {
  id: ID
  config: Config
  overlays: Overlay[]
  baseLayers: BaseLayer[]
  calqueIds?: string[]
}

export interface Config {
  zoom: number
  center: LatLng // use latLng() from leaflet to convert [number, number]
  maxBounds: LatLngBounds
  options: MapOptions
  layers: BaseLayer // "s" of layers because of leaflet
  minZoom?: number
  maxZoom?: number
  scrollWheelZoom?: boolean
  smoothWheelZoom?: boolean
  smoothSensitivity?: number
  tileSize?: number
  zoomOffset?: number
}

export interface Overlay extends GeoJSON.FeatureCollection {
  id: ID
  name: string
  visible?: boolean
  mapId?: ID
  geomType?: GeomType
  activeStyle?: LeafletStyle
}

export type leafletStyleOptions = CircleMarkerOptions | PolylineOptions

export interface LeafletStyle {
  id: number
  name: string
  ruleDTOs: any[] // TODO create leafletStyleOptions + name
}

export interface OverlayDTO {
  id: number
  mapId: string
  layerName: string
  url: string
  username: string
  password: string
  geomType: GeomType
  activeStyle: LeafletStyle
}

export interface BaseLayer {
  urlTemplate: string
  id?: string
  name?: string
  token?: string
  thumbnail?: string
  options?: TileLayerOptions
}

export type GeomType = 'point' | 'line' | 'structure'

export interface Calque {
  id: string
  name: string
  geomType: GeomType | null
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  properties: PropertyType[]
}

export interface PropertyType {
  id: string
  displayName: string
  name: string
  activeStyle: boolean
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  values: PropertyValue[]
}

export interface PropertyValue {
  id: string
  name: string
  displayName: string
  checked: boolean
  order: number
}

export interface FiltersProp {
  calqueId: string
  filters: string[]
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

export type NeighboursDirectionType = 'front' | 'back' | 'front_right' | 'front_left' | 'back_right' | 'back_left'

export interface ViewParams {
  fov: number
  pitch: number
  yaw: number
  roll?: number
}

export type LangType = 'fr' | 'en'

export interface CameraConfig {
  position: number[] | LatLng
  rotation: number
}
