import { ID } from 'app/shared/models/shared.model'
import { LngLatBounds } from 'mapbox-gl'

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
    layerIds?: {
      state: string
    }
    optionalProperties?: { key: string; value: any }[]
  }
}

export interface SectionIdDTO {
  message: string
  distance: number
  featureId: ID
}
