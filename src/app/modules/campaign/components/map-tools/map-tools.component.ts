import { AfterViewInit, Component, Input } from '@angular/core'
import booleanIntersects from '@turf/boolean-intersects/dist/js'
import * as turfHelper from '@turf/helpers'
import { geoJSON, LatLng, LatLngBounds, Layer, layerGroup, Map, Rectangle, rectangle } from 'leaflet'
import { createPolygonFromBounds } from '../../utils'

type absolutePosition = 'topright' | 'topleft' | 'bottomright' | 'bottomleft'
type toolsType = 'default' | 'selection' | 'measure'

@Component({
  selector: 'app-map-tools',
  templateUrl: './map-tools.component.html',
  styleUrls: ['./map-tools.component.scss'],
})
export class MapSelectionComponent implements AfterViewInit {
  get positionClass() {
    switch (this.position) {
      case 'topleft':
        return 'top-left'
      case 'topright':
        return 'top-right'
      case 'bottomright':
        return 'bottom-right'
      case 'bottomleft':
        return 'bottom-left'
      default:
        return 'default'
    }
  }

  get tooltipPosition() {
    switch (this.position) {
      case 'topleft':
      case 'bottomleft':
        return 'right'
      case 'topright':
      case 'bottomright':
        return 'left'
      default:
        return 'left'
    }
  }
  @Input() map: Map
  @Input() position: absolutePosition
  @Input() tool: toolsType = 'default'

  mapDiv: HTMLElement
  isDrawing = false
  featuresSelected: GeoJSON.Feature[] = []

  selectionLayerGroup = layerGroup()
  onMouseDownPoint: any
  featuresSelectedLayer: any
  rectangleSelectionLayer: Rectangle

  ngAfterViewInit(): void {
    this.mapDiv = document.getElementById('map')
    this.onAction(this.tool)
  }

  onAction(type: string): void {
    this.removeAllEventListener()
    this.clearAll()

    switch (type) {
      case 'selection':
        this.tool = 'selection'
        this.map.dragging.disable()
        this.mapDiv.addEventListener('mousedown', (event) => this.onMouseDownSelection(event))
        this.mapDiv.addEventListener('mousemove', (event) => setTimeout(() => this.onMouseMoveSelection(event), 60))
        this.mapDiv.addEventListener('mouseup', (event) => this.onMouseUpSelection(event))
        this.mapDiv.style.cursor = 'crosshair'
        break
      default:
        this.tool = 'default'
    }
  }

  onMouseDownSelection(event: MouseEvent) {
    if (this.tool === 'selection') {
      if (event.metaKey) {
        this.map.dragging.enable()
        this.mapDiv.style.cursor = ''
      } else {
        this.map.dragging.disable()
        this.mapDiv.style.cursor = 'crosshair'
        this.isDrawing = true
        this.onMouseDownPoint = this.map.mouseEventToLayerPoint(event)
      }
    }
  }

  onMouseMoveSelection(event: MouseEvent) {
    if (this.tool === 'selection' && this.isDrawing) {
      const point = this.map.mouseEventToLayerPoint(event)
      const bounds = new LatLngBounds(
        this.map.layerPointToLatLng(this.onMouseDownPoint),
        this.map.layerPointToLatLng(point)
      )

      if (this.rectangleSelectionLayer) {
        this.selectionLayerGroup.removeLayer(this.rectangleSelectionLayer)
      }

      this.rectangleSelectionLayer = rectangle(bounds, {
        color: '#11afb6',
        weight: 2.5,
        dashArray: '5px',
        lineCap: 'square',
        smoothFactor: 1,
      })

      this.selectionLayerGroup.addLayer(this.rectangleSelectionLayer)
      this.selectionLayerGroup.addTo(this.map)
    }
  }

  onMouseUpSelection(event: MouseEvent) {
    if (this.tool === 'selection' && this.isDrawing) {
      if (this.rectangleSelectionLayer) {
        this.selectionLayerGroup.removeLayer(this.rectangleSelectionLayer)
      }
      if (this.featuresSelectedLayer) {
        this.selectionLayerGroup.removeLayer(this.featuresSelectedLayer)
      }

      const point = this.map.mouseEventToLayerPoint(event)
      const isDistinctPoint = this.onMouseDownPoint.x !== point.x && this.onMouseDownPoint.y !== point.y

      if (isDistinctPoint) {
        const bounds = new LatLngBounds(
          this.map.layerPointToLatLng(this.onMouseDownPoint),
          this.map.layerPointToLatLng(point)
        )

        if (this.featuresSelected.length > 0) {
          const noIntersect = this.getFeatureInBbox(bounds).filter((item) => {
            return !this.featuresSelected.some((feature) => feature.id === item.id)
          })
          this.featuresSelected = this.featuresSelected.concat(noIntersect)
        } else {
          this.featuresSelected = this.getFeatureInBbox(bounds)
        }

        this.featuresSelectedLayer = geoJSON(this.featuresSelected as any, {
          style: {
            color: 'black',
            weight: 10,
            fillColor: 'black',
            opacity: 0.4,
            fillOpacity: 0.8,
          },
        })

        this.selectionLayerGroup.addLayer(this.featuresSelectedLayer)
        this.selectionLayerGroup.addTo(this.map)
      } else {
        this.selectionLayerGroup.removeLayer(this.featuresSelectedLayer)
        this.featuresSelected = []
      }
    }
    this.isDrawing = false
  }

  private getFeatureInBbox(bbox: any): any[] {
    const featuresSelected = []

    Object.values(this.map['_layers']).map((l: Layer) => {
      if (l['feature']) {
        // id: l['_leaflet_id']
        const featureModified = { ...l['feature'] }

        if (l['feature']['geometry']['type'] === 'Point') {
          const pt = new LatLng(l['feature']['geometry']['coordinates'][1], l['feature']['geometry']['coordinates'][0])
          if (bbox.contains(pt)) {
            featuresSelected.push(featureModified)
          }
        } else {
          const coord = l['feature']['geometry']['coordinates']
          if (bbox.contains(coord)) {
            featuresSelected.push(featureModified)
          } else {
            const intersect = booleanIntersects(
              turfHelper.polygon([createPolygonFromBounds(bbox)]),
              turfHelper.lineString(coord)
            )
            if (intersect) {
              featuresSelected.push(featureModified)
            }
          }
        }
      }
    })

    return featuresSelected
  }

  private removeAllEventListener() {
    this.mapDiv.removeEventListener('mousedown', (event) => this.onMouseDownSelection(event))
    this.mapDiv.removeEventListener('mousemove', (event) => this.onMouseMoveSelection(event))
    this.mapDiv.removeEventListener('mouseup', (event) => this.onMouseUpSelection(event))
  }

  private clearAll() {
    this.isDrawing = false
    this.mapDiv.style.cursor = ''
    this.map.dragging.enable()

    this.featuresSelected = []

    if (this.featuresSelectedLayer) {
      this.selectionLayerGroup.removeLayer(this.featuresSelectedLayer)
    }
    if (this.rectangleSelectionLayer) {
      this.selectionLayerGroup.removeLayer(this.rectangleSelectionLayer)
    }
  }
}
