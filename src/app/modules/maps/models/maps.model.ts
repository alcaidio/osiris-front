import { ID } from 'app/shared/shared.model'

export interface MapCard {
  id?: ID
  image?: string
  title: string
  subtitle: string
  link: string
}

export interface PicturePoint {
  id: number
  geom: GeoJSON.Point
  pictures: Picture[]
}

export interface Picture {
  name: string
  path: string
  camera: 'front' | 'back'
  direction: number | null
}
