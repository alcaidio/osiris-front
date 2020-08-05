import { Layer as l } from 'mapbox-gl'

export interface Layer extends l {
  visible: boolean
}
