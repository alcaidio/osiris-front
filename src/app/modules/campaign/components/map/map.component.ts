import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core'
import { UpdateActive } from '@ngxs-labs/entity-state'
import { Select, Store } from '@ngxs/store'
import {
  circle,
  DrawEvents,
  featureGroup,
  FeatureGroup,
  geoJSON,
  LatLng,
  Layer,
  layerGroup,
  Map,
  tileLayer,
} from 'leaflet'
import 'leaflet.smoothwheelzoom'
import { Observable } from 'rxjs'
import { Overlay } from '../../model/shared.model'
import { MapState } from '../../store'
import { setDefaultStyleOfFeature } from '../../utils'
import { PopupContentComponent } from '../popup-content/popup-content.component'
import { Config, Mode } from './../../model/shared.model'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges, OnDestroy {
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>

  @Input() config: Config
  @Input() mode: Mode
  @Input() overlays: Overlay[]
  @Output() creating = new EventEmitter<any>()
  @Output() map = new EventEmitter<Map>()
  @Output() selected = new EventEmitter<GeoJSON.Feature>()

  currentMapConfig: Config
  drawItems: FeatureGroup = featureGroup()
  featureSelected: GeoJSON.Feature
  mapReady: Map
  leafletLayers: Layer[] // value to bind leaflet directive

  drawOptions = {
    position: 'topright',
    draw: {
      polyline: true,
      circle: false,
      // circle: {
      //   shapeOptions: {
      //     color: '#d4af37',
      //   },
      // },
      polygon: {
        shapeOptions: {
          color: '#666',
        },
      },
      rectangle: false,
      circlemarker: false,
      edit: {
        featureGroup: this.drawItems,
      },
    },
  }

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector, private store: Store) {}

  onMapReady(map: Map): void {
    this.mapReady = map
    this.map.emit(map)
    if (this.mapReady && this.overlays) {
      this.leafletLayers = this.convertOverlaysForLeaflet(this.overlays)
      this.updateConfigMap()
    }

    // this.mapReady.on('boxzoomend', (e) => {
    //   if (e.boxZoomBounds.contains(markers[i])) {
    //     console.log(markers[i])
    //   }
    // })
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'overlays':
            if (this.mapReady && this.overlays) {
              this.leafletLayers = this.convertOverlaysForLeaflet(this.overlays)
            }
            break
          case 'config':
            const change = changes['config']
            if (!change.firstChange) {
              const prev = change.previousValue
              const curr = change.currentValue
              if (this.mapReady && this.config) {
                // TODO voir util leaflet pour token
                this.mapReady.removeLayer(tileLayer(prev.layers._url, prev.layers.options))
                this.mapReady.addLayer(tileLayer(curr.layers._url, curr.layers.options))
              }
            }
            break
        }
      }
    }
  }

  updateConfigMap(): void {
    const center = this.mapReady.getCenter()
    const zoom = this.mapReady.getZoom()

    this.mapConfig$.subscribe((config) => {
      this.currentMapConfig = { ...config, center, zoom }
    })
  }

  onDrawCreated(e: DrawEvents.Created): void {
    this.drawItems.addLayer(e.layer)

    const geojson = this.drawItems.toGeoJSON()
    console.log(geojson)
    console.log(e)

    e.layer.bindPopup(`<div>New item</div>`, {
      offset: [0, -10],
      maxHeight: 200,
      autoPan: false,
    })

    this.creating.emit(geojson)
  }

  /// private method

  private convertOverlaysForLeaflet(os: Overlay[]): Layer[] {
    let overlays = {}

    os.map((layer) => {
      const group = layerGroup()
      overlays = { ...overlays, [layer.name]: group }
      return group.addLayer(this.generateLayerGroup(layer))
    })

    // TODO: change baselayer to not null
    // This line add Controls
    // control.layers(null, overlays).addTo(this.mapReady);

    return Object.values(overlays)
  }

  private generateLayerGroup(layer: any): any {
    let geojson: any

    const onSelectFeature = (e: any) => {
      const { lat, lng } = e.latlng
      this.featureSelected = e.sourceTarget.feature
      console.log('feature selected id', this.featureSelected.id)

      if (e.sourceTarget.feature.id !== this.featureSelected.id) {
        this.mapReady.panTo([lat, lng])
        this.selected.emit(e.sourceTarget.feature)
      }
    }

    const highlightFeature = (e) => {
      const featureSyle = e.target.feature.properties.style
      if (featureSyle && Object.keys(featureSyle).includes('radius')) {
        e.target.setStyle({
          radius: featureSyle.radius * 1.2,
          fillColor: featureSyle.fillColor,
          color: featureSyle.color,
          fillOpacity: featureSyle.opacity * 0.5,
        })
      } else if (featureSyle) {
        e.target.setStyle({
          weight: featureSyle.weight * 2,
          fillColor: featureSyle.fillColor,
          color: featureSyle.color,
          fillOpacity: featureSyle.opacity * 0.5,
        })
      } else {
        console.log('No feature highlight available')
        return
      }
    }

    const resetHighlight = (e) => {
      geojson.resetStyle(e.target)
    }

    const pointToLayer = (feature: GeoJSON.Feature, latlng: LatLng) => {
      const featureSyle = feature.properties.style
      if (featureSyle) {
        return circle(latlng, {
          radius: 10,
          fillColor: featureSyle.fillColor,
          color: featureSyle.color,
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        })
      } else {
        return circle(latlng, {
          radius: 10,
          fillColor: 'red',
          color: '#888',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        })
      }
    }

    const onEachFeature = (feature: GeoJSON.Feature, l: Layer) => {
      l.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: onSelectFeature,
      })

      if (feature.properties.popupContent) {
        const factory = this.resolver.resolveComponentFactory(PopupContentComponent)
        const component = factory.create(this.injector)
        component.instance.feature = feature
        component.changeDetectorRef.detectChanges()
        const popupContent = component.location.nativeElement
        l.bindPopup(popupContent, {
          offset: [0, -10],
          maxHeight: 200,
          autoPan: true,
        })
      }
    }

    const style = (feature: GeoJSON.Feature) => {
      if (feature.properties.style) {
        return feature.properties.style
      } else {
        // Load default style
        const type = feature.geometry.type
        setDefaultStyleOfFeature(type)
      }
    }

    const filter = (feature: GeoJSON.Feature): boolean => {
      const showOnMap = feature.properties.visible
      if (showOnMap === false) {
        return false
      } else {
        // true and undefined
        return true
      }
    }

    geojson = geoJSON(layer, {
      onEachFeature,
      pointToLayer,
      style,
      filter,
    })

    return geojson
  }

  ngOnDestroy(): void {
    this.store.dispatch(new UpdateActive(MapState, { config: this.currentMapConfig }))
  }
}
