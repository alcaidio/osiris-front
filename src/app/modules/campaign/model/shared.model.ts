import { LatLng, LatLngBounds, MapOptions, TileLayerOptions } from 'leaflet'

export type ID = string | number

export interface Campaign {
  id: ID
  title: string
  subtitle?: string
  mapId?: string
  thumbnail?: string
  creationDate?: number
  editionDate?: number
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

export enum Mode {
  Read = 'read',
  Edit = 'edit',
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
  overlayIds: string[]
  baseLayerIds: string[]
  calqueIds?: string[]
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
  // STYLE ????
}

export interface BaseLayer {
  urlTemplate: string
  id?: string
  name?: string
  token?: string
  thumbnail?: string
  options?: TileLayerOptions
}

export type GeometryType = 'point' | 'line' | 'structure'

export interface Calque {
  id: string
  name: string
  geomType: GeometryType
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  legend: string
  properties: CalqueProperty[]
}

export interface CalqueProperty {
  id: string
  name: string
  checked: boolean
  indeterminate: boolean
  toggled: boolean
  values: PropertyValue[]
}

export interface PropertyValue {
  id: string
  name: string
  checked: boolean
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
