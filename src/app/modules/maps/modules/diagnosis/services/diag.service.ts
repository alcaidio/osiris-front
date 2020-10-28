import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ID } from 'app/shared/shared.model'
import { environment } from 'environments/environment'
import { Layer } from 'mapbox-gl'
import { Observable, of } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import { BaseMap } from '../models/base-map.model'
import { Section, SectionIdDTO } from '../models/section.model'

@Injectable({
  providedIn: 'root',
})
export class DiagService {
  private api = environment.osiris.api
  private diagNum = 1

  constructor(private http: HttpClient) {}

  getBaseMap(): Observable<BaseMap> {
    return this.http.get<BaseMap>(`${this.api}/diag/${this.diagNum}/config/carto`)
  }

  getLayers(): Observable<Layer[]> {
    return this.http.get<Layer[]>(`${this.api}/carto/layers?theme=sections`)
  }

  getSectionIdByLngLat(point: { lng: number; lat: number }): Observable<SectionIdDTO> {
    // TODO : li_section_view est en dure le récupérer via api 
    return this.http.get<SectionIdDTO>(`${this.api}/diag/feature?typeName=li_section_view&lng=${point.lng}&lat=${point.lat}`)
  }

  getSectionById(id: ID): Observable<Section> {
    return this.http.get<Section>(`${this.api}/diag/section/${id}`)
  }

  getSection(point: { lng: number; lat: number }): Observable<Section | HttpErrorResponse> {
    return this.getSectionIdByLngLat(point).pipe(
      mergeMap((res) => this.getSectionById(res.featureId)),
      catchError((err: HttpErrorResponse) => of(err))
    )
  }
}
