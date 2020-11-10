import { ButtonMapItem } from './../../../shared/models/maps.model'

export const mapBaseLayers: ButtonMapItem[] = [
  {
    id: 'OUTDOORS',
    icon: 'assets/images/topografic-map.png',
    tooltip: 'Topografic map',
    action: 'changeBaseLayer',
  },
  {
    id: 'LIGHT',
    icon: 'assets/images/light-map.png',
    tooltip: 'Light map',
    action: 'changeBaseLayer',
  },
  {
    id: 'SATELLITE',
    icon: 'assets/images/satellite-map.png',
    tooltip: 'Satellite map',
    action: 'changeBaseLayer',
  },
  {
    id: 'DARK',
    icon: 'assets/images/dark-map.png',
    tooltip: 'Dark map',
    action: 'changeBaseLayer',
  },
  // TODO : add others base layers
]

export const mapTools = [
  { id: '3d', icon: 'feather:codepen', tooltip: '3D', action: '3d' },
  { id: 'distance', icon: 'iconsmind:ruler', tooltip: 'Distance' },
]
