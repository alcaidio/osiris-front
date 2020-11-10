import { ID } from 'app/shared/models/shared.model'
import { Layer as l } from 'mapbox-gl'

export interface Layer extends l {
  name?: string
  visible?: boolean
}

export function generateMockLayer(id: string): Layer {
  return {
    id: `some-name-${id}-layer`,
    type: 'raster',
    name: `name of layer ${id}`,
    layout: { 'line-cap': 'square', 'line-join': 'bevel' },
    paint: { 'line-color': '#1aae61', 'line-width': 3, 'line-opacity': 1 },
    visible: true,
    source: {
      type: 'raster',
      name: `some-name-${id}-source`,
      tileSize: 256,
      tiles: ['some-tiles-url'],
      // tslint:disable-next-line: max-line-length
      // some tile url example : http://192.168.0.187:8080/geoserver/osiris/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&LAYERS=sections&STYLES=STATE&CQL_FILTER=state%3D%27MEDIUM%27&WIDTH=256&HEIGHT=256&TRANSPARENT=TRUE&FORMAT=image/png
    } as mapboxgl.RasterSource,
  }
}

export interface Filter {
  id: ID
  name: string
  visible: boolean
  color: string
}
