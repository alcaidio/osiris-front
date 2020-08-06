import { LngLatBounds } from 'mapbox-gl'
import { ID } from './../../../../shared/shared.model'

const enum State {
  Good = 'GOOD',
  Medium = 'MEDIUM',
  Bad = 'BAD',
  VeryBad = 'VERY_BAD',
}

export interface Section {
  id: ID
  bbox: LngLatBounds
  geometry: GeoJSON.LineString
  properties: {
    edgeId: number
    state: State
    streetName: string
    neighborhood: string
    city: string
    length: number
    width: number
    roadwayScore: number
    structureScore: number
    surfaceScore: number
    optionalProperties?: { key: string; value: any }[]
  }
}
