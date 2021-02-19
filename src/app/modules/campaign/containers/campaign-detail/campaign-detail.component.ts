import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Config, Mode } from '../../model/shared.model'
import { GetBaselayers, GetCalques, GetOverlays, MapState, OverlaySelectors, OverlayState, UIState } from '../../store'
import { convertConfigToLeaflet } from '../../utils'
import { CameraPositionType, NeighboursDirectionType, PicturePoint } from './../../../../shared/models/maps.model'
import { MapSmall, Overlay, Picture } from './../../model/shared.model'
import { OsirisAnimations } from './../../utils/animation.utils'

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
  animations: OsirisAnimations,
})
export class CampaignDetailComponent implements OnInit {
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>
  @Select(OverlaySelectors.getFilteredOverlays) filteredOverlays$: Observable<Overlay[]>
  @Select(OverlayState.getProperties) data$: Observable<any>
  @Select(UIState.getViewer) viewer$: Observable<boolean>
  selectedFeature: GeoJSON.Feature
  leafletMapConfig: Config
  featureList: any[]
  canAddFeature = true
  MODE = Mode.Edit
  overlayInCreation: Overlay

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
    this.featureList = []

    // data from resolvers
    const mapSmall = this.route.snapshot.data.mapSmall as MapSmall
    this.store.dispatch(new GetOverlays(mapSmall.overlayIds))
    this.store.dispatch(new GetBaselayers(mapSmall.baseLayerIds))
    this.store.dispatch(new GetCalques(mapSmall.calqueIds))

    this.mapConfig$.subscribe((config) => {
      this.leafletMapConfig = convertConfigToLeaflet(config)
    })
  }

  featureSelected(feature: GeoJSON.Feature): void {
    this.selectedFeature = feature
    this.canAddFeature = true
    this.cdr.detectChanges()
  }

  layerCreation(overlay: Overlay): void {
    this.overlayInCreation = overlay
    this.cdr.detectChanges()
  }

  onAddFeature(feature: GeoJSON.Feature): void {
    if (this.canAddFeature) {
      this.featureList.push(feature)
      this.canAddFeature = false
      this.cdr.detectChanges()
    }
  }

  onClearFeatureList(): void {
    this.featureList = []
    this.cdr.detectChanges()
  }

  onChangeMode(mode: Mode): void {
    this.MODE = mode
  }

  onChangeCameraPosition(evt: CameraPositionType) {
    console.log('onChangeCameraPosition', evt)
  }

  onChangeNeighboursDirection(evt: NeighboursDirectionType) {
    console.log('onChangeNeighboursDirection', evt)
  }
}
