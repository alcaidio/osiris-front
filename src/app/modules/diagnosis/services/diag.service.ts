import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { catchError, mergeMap } from 'rxjs/operators'
import { BaseMap } from '../../../shared/models/maps.model'
import { ID } from './../../../shared/models/shared.model'
import { Section, SectionIdDTO } from './../models/section.model'

@Injectable({
  providedIn: 'root',
})
export class DiagService {
  private api = environment.osiris.api

  constructor(private http: HttpClient) {}

  getBaseMap(): Observable<BaseMap> {
    // TODO: change header
    const requestOptions = { headers: new HttpHeaders().set('userId', '1') }
    return this.http.get<BaseMap>(`${this.api}/carto/map/road_asset`, requestOptions)
  }

  getSection(point: GeoJSON.Position): Observable<Section> {
    return this.getSectionIdByLngLat(point).pipe(
      mergeMap((res) => this.getSectionById(res.featureId)),
      catchError(null)
    )
  }

  private getSectionIdByLngLat(point: GeoJSON.Position): Observable<SectionIdDTO> {
    return this.http.get<SectionIdDTO>(
      `${this.api}/diag/feature?typeName=li_section_view&lng=${point[0]}&lat=${point[1]}`
    )
  }

  private getSectionById(id: ID): Observable<Section> {
    return this.http.get<Section>(`${this.api}/diag/section/${id}`)
  }
}
