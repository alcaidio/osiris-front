import { LngLatBounds } from 'mapbox-gl'

export enum SectionState {
  Good = 'GOOD',
  Medium = 'MEDIUM',
  Bad = 'BAD',
  VeryBad = 'VERY_BAD',
}

export interface Section {
  id: number
  geometry: GeoJSON.LineString
  edgeId: number
  bounds: LngLatBounds
  state: SectionState
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
