import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from './../../../../../environments/environment'

export enum MapillaryImageSizeEnum {
  S = 'thumb-320.jpg',
  M = 'thumb-640.jpg',
  L = 'thumb-1024.jpg',
  XL = 'thumb-2048.jpg',
}

@Injectable({
  providedIn: 'root',
})
export class MapillaryService {
  private mapillary = environment.mapillary

  constructor(private http: HttpClient) {}

  getSequences(bbox: GeoJSON.BBox): Observable<GeoJSON.FeatureCollection> {
    return this.http.get<GeoJSON.FeatureCollection>(
      `${this.mapillary.api}/sequences?client_id=${this.mapillary.clientId}&bbox=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}`
    )
  }

  getImage(imageKey: string, size: MapillaryImageSizeEnum): Observable<any> {
    return this.http.get<any>(`${this.mapillary.images}/${imageKey}/${size}`)
  }
}
