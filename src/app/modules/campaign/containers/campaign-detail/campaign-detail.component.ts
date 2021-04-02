import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { UpdateActive } from '@ngxs-labs/entity-state'
import { Select, Store } from '@ngxs/store'
import * as turfBbox from '@turf/bbox'
import * as turfHelper from '@turf/helpers'
import { RouterSelectors } from 'app/core/store/states/router.state.selector'
import { circle, geoJSON, LatLng, layerGroup, Map } from 'leaflet'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import {
  CameraConfig,
  CameraPositionType,
  Config,
  ImageType,
  Overlay,
  Picture,
  PicturePoint,
} from '../../model/campaign.model'
import * as Actions from '../../store'
import { convertConfigToLeaflet } from '../../utils'
import { OsirisAnimations } from '../../utils/animation.utils'
import { NeighboursDirectionType } from './../../model/campaign.model'

enum QueryParamsFromCampaignDetail {
  CONFIG = 'config', // 43.6596748, 3.8262439,15z
  POINT = 'point',
  CAMERA = 'camera',
  FULLSCREEN = 'fullscreen',
  // add some
}

export const convertMapConfigFromUrl = (mapConfig: string): any => {
  const config = mapConfig.split(',')
  const res = { center: { lng: config[1], lat: config[0] }, zoom: config[2].slice(0, -1) }
  return res
}

@AutoUnsubscribe()
@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
  animations: OsirisAnimations,
})
export class CampaignDetailComponent implements OnInit, OnDestroy {
  @Select(Actions.MapState.getMapConfig) mapConfig$: Observable<Config>
  @Select(Actions.OverlaySelectors.getFilteredOverlays) filteredOverlays$: Observable<Overlay[]>
  @Select(Actions.UIState.getIsViewer) isViewer$: Observable<boolean>
  @Select(Actions.UIState.getIsData) isData$: Observable<boolean>
  @Select(Actions.UIState.getIsViewerFullscreen) isViewerFullscreen$: Observable<boolean>
  @Select(Actions.OverlaySelectors.getActiveFilteredOverlayProperties) activeProperties$: Observable<any[]>
  @Select(Actions.OverlayState.getActiveOverlayFeatures) activeFeatures$: Observable<GeoJSON.Feature[]>
  @Select(Actions.CalqueState.getNewCalqueName) newCalqueName$: Observable<string>
  @Select(Actions.PicturesState.getSelectedPicture) selectedPicture$: Observable<Picture>
  @Select(Actions.PicturesState.getSelectedPicturesPoint) selectedPicturePoint$: Observable<PicturePoint>
  @Select(Actions.PicturesState.getCameraConfig) cameraConfig$: Observable<CameraConfig>
  @Select(RouterSelectors.queryParams) queryParams$: Observable<Params>

  mapReady: Map
  selectedFeature: GeoJSON.Feature
  leafletMapConfig: Config
  newCalqueName: string
  activeLayerGroup = layerGroup()
  activeLayer: any
  geoJsonFeature: any
  lastDir: number

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.queryParams$.pipe(take(1)).subscribe((queryParams) => {
      this.initState(queryParams)
    })

    this.isData$.subscribe((data) => {
      if (!data && this.geoJsonFeature) {
        this.activeLayerGroup.removeLayer(this.geoJsonFeature)
      }
      setTimeout(() => this.mapReady && this.mapReady.invalidateSize({ animate: true }), 1000)
    })

    this.newCalqueName$.subscribe((name) => (this.newCalqueName = name))

    this.selectedPicturePoint$.subscribe((point) => {
      if (point) {
        const latlng = { lng: point.geom.coordinates[0], lat: point.geom.coordinates[1] }
        this.mapReady.panTo(latlng)
      }
    })

    this.selectedPicture$.subscribe((picture) => {
      if (picture) {
        this.lastDir = picture.direction
      }
    })
  }

  private initState(params: Params) {
    // data from resolvers
    const id = this.route.snapshot.data.mapSmall.id as string
    this.store.dispatch(new Actions.GetCalques(id))
    this.store.dispatch(new Actions.GetOverlays(id))
    this.store.dispatch(new Actions.GetBaselayers(id))

    // format map config for leaflet
    const mapConfigFromUrl = params[QueryParamsFromCampaignDetail.CONFIG]
    const pointId = params[QueryParamsFromCampaignDetail.POINT]
    const camera = params[QueryParamsFromCampaignDetail.CAMERA]
    const fullscreen = params[QueryParamsFromCampaignDetail.FULLSCREEN]

    this.mapConfig$.subscribe((config) => {
      if (mapConfigFromUrl) {
        const configFromUrl = convertMapConfigFromUrl(mapConfigFromUrl)
        this.leafletMapConfig = convertConfigToLeaflet({ ...config, ...configFromUrl })
      } else {
        this.leafletMapConfig = convertConfigToLeaflet(config)
      }
    })

    if (pointId) {
      this.store
        .dispatch(new Actions.LoadPicturesPointById({ id: pointId, imageType: 'PLANAR' })) // FIX EQUIREctangular not the time
        .toPromise()
        .then(() => {
          setTimeout(() => this.mapReady && this.mapReady.invalidateSize({ animate: true }), 500)
        })
    }
    if (camera) {
      this.store.dispatch(new Actions.ChangeCameraPosition(camera))
    }
    if (fullscreen) {
      this.store.dispatch(new Actions.ToggleViewerFullscreen(fullscreen))
    }
  }

  onNavigate(position: LatLng): void {
    this.store
      .dispatch(new Actions.LoadPicturesPointByLngLat({ position, distance: 120 }))
      .toPromise()
      .then(() => {
        setTimeout(() => this.mapReady && this.mapReady.invalidateSize({ animate: true }), 500)
      })
  }

  onCloseViewer(): void {
    this.store.dispatch(new Actions.CloseViewer())
    setTimeout(() => this.mapReady && this.mapReady.invalidateSize({ animate: true }), 1000)
  }

  onToggleFullscreen(): void {
    this.store.dispatch(new Actions.CloseData())
    this.store.dispatch(new Actions.ToggleViewerFullscreen())
  }

  onChangeCamera(position: CameraPositionType): void {
    this.store.dispatch(new Actions.ChangeCameraPosition(position))
  }

  onGoToNeighbours(evt: { dir: NeighboursDirectionType; imageType: ImageType }): void {
    const { dir, imageType } = evt
    this.store.dispatch(new Actions.GoToNeighbour({ dir, imageType }))
  }

  onFlyToTheFeature(featureId: string): void {
    this.activeFeatures$.subscribe((features) => {
      const feature = features.find((f) => f.id === featureId)

      if (this.geoJsonFeature) {
        this.activeLayerGroup.removeLayer(this.geoJsonFeature)
      }

      if (feature.geometry['type'] === 'Point') {
        this.mapReady.panTo([feature.geometry['coordinates'][0][1], feature.geometry['coordinates'][0][0]])
        this.geoJsonFeature = circle(
          { lat: feature.geometry['coordinates'][0][1], lng: feature.geometry['coordinates'][0][0] } as any,
          {
            radius: 15,
            fillColor: 'black',
            weight: 4,
            color: '#11afb6',
            fillOpacity: 0.2,
          }
        )
      } else if (feature.geometry['type'] === 'MultiPolygon' || feature.geometry['type'] === 'Polygon') {
        const polygon = turfHelper.polygon(feature.geometry['coordinates'][0] as any)
        const bbox = turfBbox.default(polygon)

        this.mapReady.fitBounds(
          [
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]],
          ],
          { animate: true, duration: 1000 }
        )

        this.geoJsonFeature = geoJSON(feature as any, {
          style: {
            fillColor: 'transparent',
            weight: 15,
            color: '#11afb6',
            opacity: 0.3,
            stroke: true,
          },
        })
      } else {
        const line = feature.geometry['coordinates'][0]
        const firstPoint = line[0]
        const lastPoint = line[line.length - 1]
        this.mapReady.fitBounds(
          [
            [firstPoint[1], firstPoint[0]],
            [lastPoint[1], lastPoint[0]],
          ],
          { animate: true, duration: 1000 }
        )

        this.geoJsonFeature = geoJSON(feature as any, {
          style: {
            fillColor: 'transparent',
            weight: 15,
            color: '#11afb6',
            opacity: 0.3,
            stroke: true,
          },
        })
      }

      this.activeLayerGroup.addLayer(this.geoJsonFeature)
      this.activeLayerGroup.addTo(this.mapReady)
    })
  }

  onMapCardAction(type: string) {
    if (type === 'vue') {
      // TODO :
      console.log('ACTION: POST enregistrer nouvelle config par défaut')
      const center = this.mapReady.getCenter()
      const zoom = this.mapReady.getZoom()
      this.store.dispatch(
        new UpdateActive(Actions.MapState, (e) => ({
          ...e,
          config: {
            ...e.config,
            center,
            zoom,
          },
        }))
      )
    } else if (type === 'newCalque') {
      // TODO
      console.log('ACTION: POST add a new calque in active map')
      // const defaultCalque = {
      //   id: uuidv4(),
      //   dis: this.newCalqueName,
      //   geomType: 'line',
      //   checked: true,
      //   indeterminate: false,
      //   toggled: false,
      //   properties: [],
      // }
      // this.store.dispatch(new Add(Actions.CalqueState, defaultCalque))
    }
  }

  // TODO: for viewer 360
  // onChangeViewParams(params: ViewParams) {
  //   const rotation = this.selectedPicture.direction + radiansToDegrees(params.yaw)
  //   this.cameraConfig = { position: [3.8762640953063965, 43.62055896073537], rotation }
  //   console.log(this.cameraConfig)
  // }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}
