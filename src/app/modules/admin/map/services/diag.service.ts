import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Layer } from 'mapbox-gl'
import { Observable, of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import { ID } from './../../../../shared/shared.model'
import { BaseMap } from './../models/base-map.model'
import { Section } from './../models/section.model'

@Injectable({
  providedIn: 'root',
})
export class DiagService {
  apiCarto = environment.osiris.api.carto
  apiDiag = environment.osiris.api.diag

  constructor(private http: HttpClient) {}

  getBaseMap(): Observable<BaseMap> {
    const test = this.http.get<BaseMap>(`api/map/base`)
    console.log(test)
    return test
  }

  getLayers(): Observable<Layer[]> {
    return this.http.get<Layer[]>(`${this.apiCarto}/carto/layers/sections`)
  }

  getSection(point: { lng: number; lat: number }): Observable<Section | HttpErrorResponse> {
    return this.http.get<any>(`${this.apiCarto}/carto/layers/section?lng=${point.lng}&lat=${point.lat}`).pipe(
      mergeMap((sectionId) => this.http.get<Section>(`${this.apiDiag}/diag/section/${sectionId}`)),
      catchError((err: HttpErrorResponse) => of(err))
    )
  }

  getSectionIdByLngLat(point: { lng: number; lat: number }): Observable<number> {
    return this.http.get<number>(`${this.apiCarto}/carto/layers/section?lng=${point.lng}&lat=${point.lat}`)
  }

  getSectionById(id: ID): Observable<Section> {
    return this.http.get<Section>(`${this.apiDiag}/diag/section/${id}`)
  }
}
