export interface FeatureCollection {
  type: 'FeatureCollection'
  features: Array<Feature>
  name?: string
}

export interface Feature {
  type: 'Feature'
  geometry: Point | LineString
  properties?: any
}

export interface LineString {
  type: 'LineString'
  coordinates: Array<[number, number, number]>
}

export interface Point {
  type: 'Point'
  coordinates: [number, number, number?]
}

export interface Properties {}
