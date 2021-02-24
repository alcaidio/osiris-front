import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { circle, geoJSON, layerGroup, Map } from 'leaflet'
import moment from 'moment'
import { Observable } from 'rxjs'
import { Config, Mode } from '../../model/shared.model'
import { GetBaselayers, GetCalques, GetOverlays, MapState, OverlaySelectors, OverlayState, UIState } from '../../store'
import { convertConfigToLeaflet } from '../../utils'
import { CameraPositionType, NeighboursDirectionType, PicturePoint } from './../../../../shared/models/maps.model'
import { MapSmall, Overlay, Picture } from './../../model/shared.model'
import { CloseData, CloseViewer, ToggleViewerFullscreen } from './../../store/ui/ui.actions'
import { OsirisAnimations } from './../../utils/animation.utils'
type LangType = 'fr' | 'en'

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
  animations: OsirisAnimations,
})
export class CampaignDetailComponent implements OnInit {
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>
  @Select(OverlaySelectors.getFilteredOverlays) filteredOverlays$: Observable<Overlay[]>
  @Select(UIState.getIsViewer) isViewer$: Observable<boolean>
  @Select(UIState.getIsData) isData$: Observable<boolean>
  @Select(UIState.getIsViewerFullscreen) isViewerFullscreen$: Observable<boolean>
  @Select(OverlayState.getActiveOverlayProperties) activeProperties$: Observable<any[]>
  @Select(OverlayState.getActiveOverlayFeatures) activeFeatures$: Observable<GeoJSON.Feature[]>

  mapReady: Map

  selectedFeature: GeoJSON.Feature
  leafletMapConfig: Config
  MODE = Mode.Edit

  activeLayerGroup = layerGroup()
  activeLayer: any
  geoJsonFeature: any

  // TODO : CHANGE TEMP MOCK
  selectedPicture: Picture = {
    camera: 'front',
    direction: -116,
    name: 'IMJ_SEQ__A60016-2020-07-30-N007-55_00209.jpg',
    path: 'http://192.168.0.187/imajbox/viewer_imajbox/images-avant/AVT/IMJ_SEQ__A60016-2020-07-30-N007-55_00209.jpg',
  }

  picturePoint: PicturePoint = {
    id: 9197,
    geom: {
      type: 'Point',
      coordinates: [2.356859548457931, 48.942378340696145],
    },
    neighbours: {
      back: 9196,
      front: 9198,
    },
    timestamp: Date.now(),
    pictures: [
      {
        name: 'IMJ_SEQ__A60016-2020-07-29-N004-29_01876.jpg',
        path:
          'http://192.168.0.187/imajbox/viewer_imajbox/images-avant/AVT/IMJ_SEQ__A60016-2020-07-29-N004-29_01876.jpg',
        camera: 'front',
        direction: 0,
      },
      {
        name: 'IMJ_SEQ__Slave-A60016-2020-07-29-N004-33_02128.jpg',
        path:
          'http://192.168.0.187/imajbox/viewer_imajbox/images-arriere/ARR/IMJ_SEQ__Slave-A60016-2020-07-29-N004-33_02128.jpg',
        camera: 'back',
        direction: 178,
      },
    ],
  }

  constructor(private store: Store, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // data from resolvers
    const mapSmall = this.route.snapshot.data.mapSmall as MapSmall
    this.store.dispatch(new GetOverlays(mapSmall.overlayIds))
    this.store.dispatch(new GetBaselayers(mapSmall.baseLayerIds))
    this.store.dispatch(new GetCalques(mapSmall.calqueIds))

    this.mapConfig$.subscribe((config) => {
      this.leafletMapConfig = convertConfigToLeaflet(config)
    })

    this.isData$.subscribe((data) => {
      if (!data && this.geoJsonFeature) {
        this.activeLayerGroup.removeLayer(this.geoJsonFeature)
      }
      setTimeout(() => this.mapReady.invalidateSize({ animate: true }), 450)
    })
  }

  onChangeCameraPosition(evt: CameraPositionType) {
    console.log('onChangeCameraPosition', evt)
  }

  onChangeNeighboursDirection(evt: NeighboursDirectionType) {
    console.log('onChangeNeighboursDirection', evt)
  }

  onCloseNavigation() {
    this.store.dispatch(new CloseViewer())
    setTimeout(() => this.mapReady.invalidateSize({ animate: true }), 450)
  }

  onFullscreenNavigation() {
    this.store.dispatch(new CloseData())
    this.store.dispatch(new ToggleViewerFullscreen())
  }

  onFlyToTheFeature(featureId: number) {
    this.activeFeatures$.subscribe((features) => {
      const feature = features.find((f) => f.id === featureId)

      if (this.geoJsonFeature) {
        this.activeLayerGroup.removeLayer(this.geoJsonFeature)
      }

      if (feature.geometry['type'] === 'Point') {
        this.mapReady.panTo([feature.geometry['coordinates'][1], feature.geometry['coordinates'][0]])
        this.geoJsonFeature = circle(
          { lat: feature.geometry['coordinates'][1], lng: feature.geometry['coordinates'][0] } as any,
          {
            radius: 15,
            fillColor: 'black',
            weight: 4,
            color: '#11afb6',
            fillOpacity: 0.2,
          }
        )
      } else {
        if (feature.bbox) {
          this.mapReady.fitBounds(
            [
              [feature.bbox[1], feature.bbox[0]],
              [feature.bbox[3], feature.bbox[2]],
            ],
            { animate: true, duration: 2000 }
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
          console.warn('Pas de point ni de bbox')
        }
      }

      this.activeLayerGroup.addLayer(this.geoJsonFeature)
      this.activeLayerGroup.addTo(this.mapReady)
    })
  }

  // TODO other lang
  private getDate(time: number, lang: LangType) {
    if (lang === 'fr') {
      const duration = new Date(time)
      return moment(duration).locale('fr').format('Do MMMM YYYY à hh:mm:ss')
    }
  }

  get viewerImageInfos(): string {
    return 'Caméra "' + this.selectedPicture?.camera + '" - ' + this.getDate(this.picturePoint?.timestamp, 'fr')
  }
}
