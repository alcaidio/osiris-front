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
import { ActivatedRoute } from '@angular/router'
import { Navigate } from '@ngxs/router-plugin'
import { Select, Store } from '@ngxs/store'
import { circle, control, geoJSON, icon, LatLng, Layer, layerGroup, Map, marker, tileLayer } from 'leaflet'
import 'leaflet-rotatedmarker'
import 'leaflet.polylinemeasure'
import 'leaflet.smoothwheelzoom'
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe'
import { Observable } from 'rxjs'
import { CameraConfig, Config, Overlay, Rule } from '../../model/campaign.model'
import { MapState, ToggleIsHoverTrace } from '../../store'
import { cleanString, getFeatureStyle } from '../../utils'
import { PopupContentComponent } from '../popup-content/popup-content.component'

// TODO : refacto, limit the mapping as much as possible
// using dictionaries and store the recalculated values ​​in global variables
// probably dont map over all feature in the same overlay keep style in cache
@AutoUnsubscribe()
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnChanges, OnDestroy {
  @Input() config: Config
  @Input() overlays: Overlay[]
  @Input() activeFeature: GeoJSON.Feature
  @Input() cameraConfig: CameraConfig

  @Output() map = new EventEmitter<Map>()
  @Output() selected = new EventEmitter<GeoJSON.Feature>()
  @Output() guyDragEnd = new EventEmitter<LatLng>()

  // normally the component has no direct data via the store. Thereafter the data must only pass through the inputs
  @Select(MapState.getMapConfig) mapConfig$: Observable<Config>

  mapReady: Map
  leafletLayers: Layer[] // value to bind leaflet directive
  cameraMarker: any

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private store: Store,
    private route: ActivatedRoute
  ) {}

  onMapReady(map: Map): void {
    this.mapReady = map
    this.map.emit(map)
    if (this.mapReady && this.overlays) {
      this.leafletLayers = this.convertOverlaysForLeaflet(this.overlays)

      control.polylineMeasure(polylineMeasureOption).addTo(map)
      // control.zoom({ position: 'bottomleft' }).addTo(map)
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
            if (change && !change.firstChange) {
              const prev = change.previousValue
              const curr = change.currentValue
              if (this.mapReady && this.config && prev && curr) {
                // TODO voir util leaflet pour token
                this.mapReady.removeLayer(tileLayer(prev.layers._url, prev.layers.options))
                this.mapReady.addLayer(tileLayer(curr.layers._url, curr.layers.options))
              }
            }
            break
          case 'cameraConfig':
            if (this.cameraConfig && this.cameraConfig.position && this.cameraConfig.rotation) {
              this.displayCamera()
            }
            break
        }
      }
    }
  }

  private displayCamera() {
    let markerOptions: any

    markerOptions = {
      icon: icon({
        iconUrl: 'assets/images/camera.svg',
        iconSize: [60, 60],
        className: 'camera',
      }),
      rotationOrigin: 'center center',
    }

    if (this.cameraMarker !== undefined) {
      this.mapReady.removeLayer(this.cameraMarker)
    }

    this.cameraMarker = marker([this.cameraConfig.position[1], this.cameraConfig.position[0]], markerOptions)
    this.cameraMarker.setRotationAngle(-this.cameraConfig.rotation)
    this.cameraMarker.addTo(this.mapReady).on('click', (e) => this.mapReady.panTo(e.latlng))
  }

  // TODO when you want to add leaflet draw features
  // onDrawCreated(e: DrawEvents.Created): void {
  //   this.drawItems.addLayer(e.layer)

  //   const geojson = this.drawItems.toGeoJSON()
  //   console.log(geojson)
  //   console.log(e)

  //   e.layer.bindPopup(`<div>New item</div>`, {
  //     offset: [0, -10],
  //     maxHeight: 200,
  //     autoPan: false,
  //   })
  // }

  setDefaultView(): void {
    this.mapConfig$.subscribe((config) => {
      this.mapReady.flyTo(config.center, config.zoom)
    })
  }

  updateConfigMapInUrl() {
    const center = this.mapReady.getCenter()
    const zoom = this.mapReady.getZoom()
    const config = `${center.lat.toFixed(7)},${center.lng.toFixed(7)},${zoom}z`
    this.store.dispatch(new Navigate([], { config }, { queryParamsHandling: 'merge', relativeTo: this.route }))
  }

  private convertOverlaysForLeaflet(os: Overlay[]): Layer[] {
    let overlays = {}

    // TODO : dont add if exist in store
    os.map((layer: Overlay) => {
      const group = layerGroup()
      overlays = { ...overlays, [layer.layerName]: group }
      return group.addLayer(this.generateLayerGroup(layer))
    })

    // TODO: change baselayer to not null
    // This line add Controls
    // control.layers(null, overlays).addTo(this.mapReady);

    return Object.values(overlays)
  }

  private generateLayerGroup(layer: Overlay): any {
    let geojson: any
    const activeStyleSet = layer.activeStyleSet.find((s) => s.type === 'LIGHT') // TODO : get light or dark with the active theme
    const activeModel = layer.featureTypeModel.find(
      (e) => cleanString(e.keyName) === cleanString(activeStyleSet.keyName)
    )
    let featureSyle: Rule

    const onSelectFeature = (e: any) => {
      // this.featureSelected = e.sourceTarget.feature
      // console.log('feature selected id', this.featureSelected.id)
      // const { lat, lng } = e.latlng
      // this.mapReady.flyTo([lat, lng])
    }

    const style = (feature: GeoJSON.Feature) => {
      featureSyle = getFeatureStyle(activeStyleSet, activeModel, feature)
      return featureSyle
    }

    const highlightFeature = (e) => {
      if (layer.module.toUpperCase() === 'PICTURES') {
        this.store.dispatch(new ToggleIsHoverTrace())
      }
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
      if (layer.module.toUpperCase() === 'PICTURES') {
        this.store.dispatch(new ToggleIsHoverTrace())
      }
    }

    const pointToLayer = (feature: GeoJSON.Feature, latlng: LatLng) => {
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
        // click: onSelectFeature,
      })

      if (feature.properties) {
        const factory = this.resolver.resolveComponentFactory(PopupContentComponent)
        const component = factory.create(this.injector)
        component.instance.feature = feature
        component.instance.overlay = layer
        component.instance.map = this.mapReady
        component.changeDetectorRef.detectChanges()
        const popupContent = component.location.nativeElement

        l.bindPopup(popupContent, {
          offset: [0, -10],
          minWidth: 150,
          autoPan: true,
          closeButton: true,
          closeOnClick: true,
          closeOnEscapeKey: true,
        })
      }
    }

    // const filter = (feature: GeoJSON.Feature): boolean => {
    //   const showOnMap = feature.properties.visible
    //   if (showOnMap === false) {
    //     return false
    //   } else {
    //     // true and undefined
    //     return true
    //   }
    // }

    geojson = geoJSON(layer, {
      onEachFeature,
      pointToLayer,
      style,
      // filter,
    })

    return geojson
  }

  navigate(evt: LatLng) {
    this.guyDragEnd.emit(evt)
  }

  ngOnDestroy(): void {
    // Don't remove !
    // here because of AutoUnsubscrive() above the component decorator.
  }
}

// Module leaflet draw if draw feature ok
// export const drawOptions = {
//   position: 'topright',
//   draw: {
//     polyline: true,
//     circle: false,
//     // circle: {
//     //   shapeOptions: {
//     //     color: '#d4af37',
//     //   },
//     // },
//     polygon: {
//       shapeOptions: {
//         color: '#666',
//       },
//     },
//     rectangle: false,
//     circlemarker: false,
//     // edit: {
//     //   featureGroup: this.drawItems,
//     // },
//   },
// }

// Plugin leaflet measure
export const polylineMeasureOption = {
  position: 'bottomright', // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
  unit: 'metres', // Show imperial or metric distances. Values: 'metres', 'landmiles', 'nauticalmiles'
  clearMeasurementsOnStop: true, // Clear all the measurements when the control is unselected
  showBearings: false, // Whether bearings are displayed within the tooltips
  bearingTextIn: 'In', // language dependend label for inbound bearings
  bearingTextOut: 'Out', // language dependend label for outbound bearings
  tooltipTextDraganddelete: 'Click and drag to <b>move point</b><br>Press SHIFT-key and click to <b>delete point</b>',
  tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
  tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>', // language dependend labels for point's tooltips
  measureControlTitleOn: 'Turn on PolylineMeasure', // Title for the control going to be switched on
  measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the control going to be switched off
  measureControlLabel: '&#8614;', // Label of the Measure control (maybe a unicode symbol)
  measureControlClasses: [], // Classes to apply to the Measure control
  showClearControl: true, // Show a control to clear all the measurements
  clearControlTitle: 'Clear Measurements', // Title text to show on the clear measurements control button
  clearControlLabel: '&times', // Label of the Clear control (maybe a unicode symbol)
  clearControlClasses: [], // Classes to apply to clear control button
  showUnitControl: false, // Show a control to change the units of measurements
  unitControlTitle: {
    // Title texts to show on the Unit Control button
    text: 'Change Units',
    metres: 'metres',
    landmiles: 'land miles',
    nauticalmiles: 'nautical miles',
  },
  unitControlLabel: {
    // Label symbols to show in the Unit Control button
    metres: 'm',
    kilometres: 'km',
    feet: 'ft',
    landmiles: 'mi',
    nauticalmiles: 'nm',
  },
  tempLine: {
    // Styling settings for the temporary dashed line
    color: '#11afb6', // Dashed line color
    weight: 2, // Dashed line weight
  },
  fixedLine: {
    // Styling for the solid line
    color: '#233564', // Solid line color
    weight: 2, // Solid line weight
  },
  startCircle: {
    // Style settings for circle marker indicating the starting point of the polyline
    color: '#0e9f6e', // Color of the border of the circle
    weight: 2, // Weight of the circle
    fillColor: '#0f0', // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 4, // Radius of the circle
  },
  intermedCircle: {
    // Style settings for all circle markers between startCircle and endCircle
    color: '#e3a008', // Color of the border of the circle
    weight: 2, // Weight of the circle
    fillColor: '#fce96a', // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 4, // Radius of the circle
  },
  currentCircle: {
    // Style settings for circle marker indicating the latest point of the polyline during drawing a line
    color: '#e02424', // Color of the border of the circle
    weight: 2, // Weight of the circle
    fillColor: '#f05252', // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 4, // Radius of the circle
  },
  endCircle: {
    // Style settings for circle marker indicating the last point of the polyline
    color: '#000', // Color of the border of the circle
    weight: 2, // Weight of the circle
    fillColor: '#e02424', // Fill color of the circle
    fillOpacity: 1, // Fill opacity of the circle
    radius: 4, // Radius of the circle
  },
}
