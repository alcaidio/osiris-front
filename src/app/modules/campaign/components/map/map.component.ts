import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
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
import { Overlay } from '../../model/shared.model'
import { setDefaultStyleOfFeature } from '../../utils'
import { PopupContentComponent } from '../popup-content/popup-content.component'
import { Config, Mode } from './../../model/shared.model'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges {
  @Input() overlays: Overlay[]
  @Input() config: Config
  @Input() mode: Mode
  @Output() selected = new EventEmitter<GeoJSON.Feature>()
  @Output() creating = new EventEmitter<any>()
  featureSelected: GeoJSON.Feature
  map: Map
  drawItems: FeatureGroup = featureGroup()
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

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

  onMapReady(map: Map): void {
    this.map = map
    if (this.map && this.overlays) {
      this.leafletLayers = this.convertOverlaysForLeaflet(this.overlays)
    }

    // this.map.on('boxzoomend', (e) => {
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
            if (this.map && this.overlays) {
              this.leafletLayers = this.convertOverlaysForLeaflet(this.overlays)
            }
            break
          case 'config':
            const change = changes['config']
            if (!change.firstChange) {
              const prev = change.previousValue
              const curr = change.currentValue
              if (this.map && this.config) {
                // TODO voir util leaflet pour token
                this.map.removeLayer(tileLayer(prev.layers._url, prev.layers.options))
                this.map.addLayer(tileLayer(curr.layers._url, curr.layers.options))
              }
            }
            break
        }
      }
    }
  }

  // TODO Add it to the store and merge with initial config to get that config after navigation
  onUpdateConfigMap(): Partial<Config> {
    const center = this.map.getCenter()
    const zoom = this.map.getZoom()
    return { zoom, center }
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
    // control.layers(null, overlays).addTo(this.map);

    return Object.values(overlays)
  }

  private generateLayerGroup(layer: any): any {
    let geojson: any

    const onSelectFeature = (e: any) => {
      const { lat, lng } = e.latlng
      this.featureSelected = e.sourceTarget.feature
      console.log(this.featureSelected.id)

      if (e.sourceTarget.feature.id !== this.featureSelected.id) {
        this.map.panTo([lat, lng])
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
}
