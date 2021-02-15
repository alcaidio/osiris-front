import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Config, Mode } from '../../model/shared.model'
import { GetBaselayers, GetCalques, GetOverlays, MapState, OverlaySelectors, OverlayState } from '../../store'
import { convertConfigToLeaflet } from '../../utils'
import { MapSmall, Overlay } from './../../model/shared.model'

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
})
export class CampaignDetailComponent implements OnInit {
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>
  @Select(OverlaySelectors.getFilteredOverlays) filteredOverlays$: Observable<Overlay[]>
  @Select(OverlayState.getProperties) data$: Observable<any>
  selectedFeature: GeoJSON.Feature
  leafletMapConfig: Config
  featureList: any[]
  canAddFeature = true
  MODE = Mode.Edit
  overlayInCreation: Overlay

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
}
