import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Select, Store } from '@ngxs/store'
import { Observable } from 'rxjs'
import { Config, Mode, Overlay } from '../../model/shared.model'
import { GetBaselayers, GetCalques, GetOverlays, MapState, OverlaySelectors } from '../../store'
import { MapSmall } from './../../model/shared.model'

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
})
export class CampaignDetailComponent implements OnInit {
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>
  @Select(OverlaySelectors.getFilteredOverlays) filteredOverlays$: Observable<any>

  selectedFeature: GeoJSON.Feature
  config: Config

  /////
  featureList: any[]
  canAddFeature = true
  MODE = Mode.Edit
  overlayInCreation: Overlay

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol']

  dataSource = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ]

  constructor(private store: Store, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.featureList = []

    // data from resolvers
    const mapSmall = this.route.snapshot.data.mapSmall as MapSmall
    this.store.dispatch(new GetOverlays(mapSmall.overlayIds))
    this.store.dispatch(new GetBaselayers(mapSmall.baseLayerIds))
    this.store.dispatch(new GetCalques(mapSmall.calqueIds))
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
