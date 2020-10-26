import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from './../../../../../environments/environment'
import { PicturePoint } from './../models/maps.model'

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private api = environment.osiris.api

  constructor(private http: HttpClient) { }
  
  getImageByLngLat(point: GeoJSON.Position): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(`${this.api}/pictures/position/findNearestBySensorAndLngLat?lng=${point[0]}&lat=${point[1]}&sensorTypeName=ImajBox`)
  }
}
