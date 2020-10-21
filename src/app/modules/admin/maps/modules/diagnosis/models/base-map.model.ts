import { LngLatBoundsLike, LngLatLike, Style } from 'mapbox-gl'
import { CursorStyle } from '../../../../../../shared/models/ui.models'

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
