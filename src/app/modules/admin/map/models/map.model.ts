export interface FeatureCollection extends GeoJSON.FeatureCollection {
  properties?: any
}

export interface Feature {
  id?: string | number
  type: 'Feature'
  geometry: GeoJSON.Geometry
  properties?: any
}

export interface Section extends Feature {
  properties: Properties
}

export interface Properties {
  pk: number
  id_bdtopo: string
  nom_rue: string
  longueur: number
  etat_ch: 'Bon' | 'Moyen' | 'Mauvais' | 'Très mauvais'
  commune: string
  quartier?: string
  domaniali?: string
  hierarchie?: string
  ch_revet?: string
  ch_larg?: number
  surface?: number
  n_surf?: number
  n_stru?: number
  note_chau?: number
}
