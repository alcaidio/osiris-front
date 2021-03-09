import { LatLngBounds, tileLayer } from 'leaflet'
import { BaseLayer, Config } from '../model/shared.model'

export const convertConfigToLeaflet = (config: Config) => {
  let tile
  // add params for smooth zoom
  const smoothZoomParams = {
    scrollWheelZoom: false,
    smoothWheelZoom: true,
    smoothSensitivity: 2,
  }

  if (config.layers) {
    tile = convertBaselayersForLeaflet(config.layers)
    return { ...config, ...smoothZoomParams, layers: tile as any }
  } else {
    return { ...config, ...smoothZoomParams }
  }
}

export const convertBaselayersForLeaflet = (baselayer: BaseLayer) => {
  if (!!baselayer.token) {
    return tileLayer(
      `${baselayer.urlTemplate}?access_token=${baselayer.token}`,
      baselayer.options ? baselayer.options : null
    )
  } else {
    return tileLayer(baselayer.urlTemplate, baselayer.options ? baselayer.options : null)
  }
}

export const convertBaselayersForLeafletControl = (baselayers: BaseLayer[]): any => {
  const res = []
  baselayers.map((baselayer) => {
    const bl = convertBaselayersForLeaflet(baselayer)
    res.push({ [baselayer.name]: bl })
  })
  return res
}

export const setDefaultStyleOfFeature = (type): any => {
  switch (type) {
    case 'Point':
    case 'MultiPoint':
      return {
        color: '#ff7800',
        weight: 4,
        radius: 8,
        fillCollor: '#ff7600',
        opacity: 0.8,
      }
      break
    case 'LineString':
    case 'MultiLineString':
      return {
        color: '#ff7800',
        weight: 5,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }
    case 'Polygon':
    case 'MultiPolygon':
      return {
        color: '#ff7800',
        fillCollor: '#555',
        weight: 5,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }
      break
  }
}

export const createPolygonFromBounds = (bounds: LatLngBounds): any => {
  const a = [bounds.getSouthWest().lng, bounds.getSouthWest().lat]
  const b = [bounds.getSouthWest().lng, bounds.getNorthEast().lat]
  const c = [bounds.getNorthEast().lng, bounds.getNorthEast().lat]
  const d = [bounds.getNorthEast().lng, bounds.getSouthWest().lat]
  return [a, b, c, d, a]
}
