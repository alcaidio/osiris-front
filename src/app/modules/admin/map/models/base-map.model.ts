import { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'
import { CursorStyle } from './../../../../shared/models/ui.models'

export interface BaseMap {
  style: string
  center: LngLatLike
  zoom: [number]
  pitch: [number]
  maxBounds?: LngLatBoundsLike
  cursorStyle?: CursorStyle
  bearing?: [number]
  //   bounds: LngLatBoundsLike
  //   minZoom: number
  //   maxZoom: number
}
