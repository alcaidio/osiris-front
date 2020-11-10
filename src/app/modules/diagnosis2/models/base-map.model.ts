import { CursorStyle } from 'app/shared/models/ui.model'
import { LngLatBoundsLike, LngLatLike, Style } from 'mapbox-gl'

export interface BaseMap {
  style: string | Style
  maxBounds: LngLatBoundsLike
  bounds: LngLatBoundsLike
  minZoom: number
  pitch: number
  bearing?: number
  cursorStyle?: CursorStyle
  center?: LngLatLike
  zoom?: number
  maxZoom?: number
}
