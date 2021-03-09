import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { combineAll, map, switchMap } from 'rxjs/operators'
import { BaseLayer, Calque, Campaign, LeafletStyle, MapSmall, OverlayDTO } from '../model/shared.model'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Lunch json-server with "json-server --watch db.json --delay 2000"

  constructor(private http: HttpClient) {}

  // mapabstract or campaign ?
  getCampaignList(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>('http://localhost:3000/mapabstracts')
  }

  getMap(id: string): Observable<MapSmall> {
    return this.http.get<MapSmall>(`http://localhost:3000/maps/${id}`)
  }

  getOverlaysByMapId(id: string): any {
    const res = this.http.get<OverlayDTO[]>(`http://localhost:3000/maps/${id}/overlays`).pipe(
      switchMap((overlayDTOs) => {
        return overlayDTOs.map((DTO) => {
          const overlayWithoutFeatures = {
            id: DTO.id,
            name: DTO.layerName,
            visible: true,
            mapId: DTO.mapId,
            geomType: DTO.geomType,
            activeStyle: DTO.activeStyle,
          }
          const httpOptions = {
            headers: new HttpHeaders({
              Authorization: 'Basic ' + btoa(`${DTO.username}:${DTO.password}`),
              skip: 'true',
            }),
          }
          return this.http.get<any>(DTO.url, httpOptions).pipe(
            map((featureCollection) => {
              return { ...overlayWithoutFeatures, type: featureCollection.type, features: featureCollection.features }
            })
          )
        })
      }),
      combineAll()
    )
    res.subscribe((p) => console.log(p))
    return res
  }

  getOverlayConfigsByMapId(id: string): Observable<Calque[]> {
    return this.http.get<Calque[]>(`http://localhost:3000/maps/${id}/overlayconfigs`)
  }

  getBaselayersByMapId(id: string): Observable<BaseLayer[]> {
    return this.http.get<BaseLayer[]>(`http://localhost:3000/maps/${id}/baselayers`)
  }

  // (prop id or overlayconfigs) === style id
  getStyleById(id: string): Observable<LeafletStyle> {
    return this.http.get<LeafletStyle>(`http://localhost:3000/style/${id}`)
  }
}
