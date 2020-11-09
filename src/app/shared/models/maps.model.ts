import { ID } from 'app/shared/models/shared.model'
import { CursorStyle } from 'app/shared/models/ui.model'
import { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'

export interface MapCard {
  id?: ID
  image?: string
  title: string
  subtitle: string
  link: string
}

export interface PicturePoint {
  id: number
  geom: GeoJSON.Point
  pictures: Picture[]
  timestamp: number
  neighbours: {
    previous: number
    next: number
    previous_far: number
    next_far: number
  }
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

export interface MapConfig {
  style?: string
  maxBounds?: LngLatBoundsLike
  bounds?: LngLatBoundsLike
  minZoom?: number
  maxZoom?: number
  pitch?: number
  bearing?: number
  cursorStyle?: CursorStyle
  center?: LngLatLike
  zoom?: number
}

export interface BaseMap {
  id: number
  config: MapConfig
  baselayers: Baselayer[]
  overlays: Overlay[]
}

export interface Overlay {
  id: string
  name: string
  visible: boolean
  type: string
  source: Source
  layout?: Layout
  paint?: Paint
}

export interface Paint {
  'line-color': string
  'line-width': number
  'line-opacity': number
}

export interface Layout {
  'line-cap': string
  'line-join': string
}

export interface Source {
  data?: string
  name?: string
  type?: string
  tiles?: string[]
  tileSize?: number
}

export interface Baselayer {
  shortname: string
  fullname: string
  style: string
  type: string
  visible: boolean
}
