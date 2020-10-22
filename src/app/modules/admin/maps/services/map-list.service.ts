import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { MapCard } from './../models/maps.model'

@Injectable({
  providedIn: 'root'
})
export class MapListService {

  constructor(private http: HttpClient) { }

  getMapCardList(): Observable<MapCard[]> {
    return this.http.get<MapCard[]>('api/maps/all')
  }

}
