import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { map } from 'rxjs/operators'
import { Section } from '../models/map.model'

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private _http: HttpClient) {}

  getSections(): Observable<Section[]> {
    return this._http.get<Section[]>('api/map/sections/all')
  }

  getSectionById(id: string): Observable<Section> {
    return this._http
      .get<Section>('api/map/sections/id', { params: { id } })
      .pipe(
        map((section: any) => {
          if (!section) {
            return throwError('Could not found section with id of ' + id + '!')
          }
          return section
        })
      )
  }
}
