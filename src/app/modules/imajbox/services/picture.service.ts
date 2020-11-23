import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { BaseMap, PicturePoint } from '../../../shared/models/maps.model'

@Injectable({
  providedIn: 'root',
})
export class PictureService {
  private api = environment.osiris.api

  constructor(private http: HttpClient) {}

  getImageByLngLat(point: GeoJSON.Position, distance: string): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(
      `${this.api}/pictures/position/findNearestBySensorAndLngLat?lng=${point[0]}&lat=${point[1]}&sensorTypeName=ImajBox&distance=${distance}`
    )
  }

  getBaseMap(): Observable<BaseMap> {
    // TODO: change header
    const requestOptions = { headers: new HttpHeaders().set('userId', '1') }
    return this.http.get<BaseMap>(`${this.api}/carto/map/pictures`, requestOptions)
  }
}
