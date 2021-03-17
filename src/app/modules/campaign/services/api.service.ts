import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ID } from 'app/shared/models'
import { environment } from 'environments/environment'
import { LatLng } from 'leaflet'
import { Observable, of } from 'rxjs'
import { catchError, combineAll, map, switchMap } from 'rxjs/operators'
import { BaseLayer, Calque, Campaign, LeafletStyle, MapSmall, OverlayDTO, PicturePoint } from '../model/campaign.model'

@Injectable()
export class ApiService {
  // Lunch json-server with "json-server --watch db.json --delay 2000"
  private api = environment.osiris.api

  constructor(private http: HttpClient) {}

  // mapabstract or campaign ?
  getCampaignList(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>('http://localhost:3000/mapabstracts')
  }

  getMap(id: string): Observable<MapSmall> {
    return this.http.get<MapSmall>(`http://localhost:3000/maps/${id}`)
  }

  getOverlaysByMapId(id: string): any {
    return this.http.get<OverlayDTO[]>(`http://localhost:3000/maps/${id}/overlays`).pipe(
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
              skip: 'true', // to not inject the token in the the core interceptor
            }),
          }

          return this.http.get<any>(DTO.url, httpOptions).pipe(
            map((data) => {
              return { ...overlayWithoutFeatures, type: data.type, features: data.features }
            }),
            catchError((err) => {
              console.warn(
                `La couche "${overlayWithoutFeatures.name}" (id n°${overlayWithoutFeatures.id}) n'a pas pu être chargée via geoserver. Error: ${err}`
              )
              return of({ ...overlayWithoutFeatures, features: [] })
            })
          )
        })
      }),
      combineAll()
    )
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

  getImageByLngLat(point: LatLng, distance?: string): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(
      `${this.api}/pictures/position/findNearestBySensorAndLngLat?lng=${point.lng}&lat=${
        point.lat
      }&sensorTypeName=ImajBox&distance=${distance ? distance : '150'}`
    )
  }

  getImageById(id: ID): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(`${this.api}/pictures/position/${id}?sensorTypeName=ImajBox`)
  }
}
