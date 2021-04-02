import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Store } from '@ngxs/store'
import { ID } from 'app/shared/models'
import { environment } from 'environments/environment'
import { LatLng } from 'leaflet'
import { Observable, of } from 'rxjs'
import { catchError, combineAll, map, switchMap } from 'rxjs/operators'
import {
  BaseLayer,
  Calque,
  Campaign,
  GeoServerDTO,
  ImageType,
  MapSmall,
  Overlay,
  PicturePoint,
} from '../model/campaign.model'
import { AuthStatusState } from './../../auth/store'
import { StyleSet } from './../model/campaign.model'

@Injectable()
export class ApiService {
  // Lunch json-server with "json-server --watch db.json --delay 2000"
  private api = environment.osiris.api
  private ORGANIZATION = null

  constructor(private http: HttpClient, private store: Store) {
    this.ORGANIZATION = this.store.selectSnapshot(AuthStatusState.getOrganizationKeyName)
  }

  getCampaignList(): Observable<Campaign[]> {
    const headers = new HttpHeaders().set('organizationKeyName', this.ORGANIZATION)
    return this.http.get<Campaign[]>(`${this.api}/carto/mapabstracts`, { headers: headers })
  }

  getMap(id: ID): Observable<MapSmall> {
    return this.http.get<MapSmall>(`${this.api}/carto/map/${id}`)
  }

  getOverlaysByMapId(mapId: ID): any {
    return this.http.get<Overlay[]>(`${this.api}/carto/map/${mapId}/overlays`).pipe(
      switchMap((overlayDTOs) => {
        return overlayDTOs.map((DTO: Partial<Overlay>) => {
          const overlayWithoutFeatures = {
            ...DTO,
            visible: true,
          }

          const httpOptions = {
            headers: new HttpHeaders({
              Authorization: 'Basic ' + btoa(`${DTO.username}:${DTO.password}`),
              skip: 'true', // to not inject the token in the the core interceptor
            }),
          }

          return this.http.get<GeoServerDTO>(`${DTO.url}&srsName=EPSG:4326`, httpOptions).pipe(
            map((data: GeoServerDTO) => {
              return { ...overlayWithoutFeatures, features: data.features }
            }),
            catchError((err) => {
              console.warn(
                `La couche "${overlayWithoutFeatures.displayName}" (id n°${overlayWithoutFeatures.id}) n'a pas pu être chargée via geoserver. Error: ${err}`
              )
              return of({ ...overlayWithoutFeatures, features: [] })
            })
          )
        })
      }),
      combineAll()
    )
  }

  getOverlayConfigsByMapId(mapId: ID): Observable<Calque[]> {
    return this.http.get<Calque[]>(`${this.api}/carto/map/${mapId}/overlayconfigs`)
  }

  getBaselayersByMapId(mapId: ID): Observable<BaseLayer[]> {
    return this.http.get<BaseLayer[]>(`${this.api}/carto/map/${mapId}/baselayers`)
  }

  getStyleByKeyName(keyName: string): Observable<StyleSet> {
    return this.http.get<StyleSet>(`${this.api}/carto/style/${keyName}`)
  }

  getImageByLngLat(point: LatLng, distance?: string): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(
      `${this.api}/pictures/positions?organizationKeyName=${this.ORGANIZATION}&lng=${point.lng}&lat=${
        point.lat
      }&distance=${distance ? distance : '150'}`
    )
  }

  getImageById(id: ID, imageType: ImageType): Observable<PicturePoint> {
    return this.http.get<PicturePoint>(
      `${this.api}/pictures/positions/${id}?organizationKeyName=${this.ORGANIZATION}&sensorImageTypeName=${imageType}`
    )
  }

  updateFeature(body: {
    featureId: ID
    overlayId: ID
    organizationPropertyKeyName: string
    value: string
  }): Observable<string> {
    const { featureId, ...bodyParams } = body
    // TODO : should be a put
    return this.http.post<string>(`${this.api}/carto/feature/${featureId}`, bodyParams)
  }
}
