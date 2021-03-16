import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core'
import { Select } from '@ngxs/store'
import booleanIntersects from '@turf/boolean-intersects/dist/js'
import * as turfHelper from '@turf/helpers'
import { NotificationService } from 'app/shared/services/notification.service'
import { geoJSON, LatLng, LatLngBounds, Layer, layerGroup, Map, Rectangle, rectangle } from 'leaflet'
import { Observable, Subscription } from 'rxjs'
import { OverlayState, PicturesState, UIState } from '../../store'
import { createPolygonFromBounds } from '../../utils'

type absolutePosition = 'topright' | 'topleft' | 'bottomright' | 'bottomleft'
type toolsType = 'default' | 'selection' | 'measure'

@Component({
  selector: 'app-map-tools',
  templateUrl: './map-tools.component.html',
  styleUrls: ['./map-tools.component.scss'],
})
export class MapSelectionComponent implements AfterViewInit, OnDestroy {
  @Input() map: Map
  @Input() position: absolutePosition
  @Input() tool: toolsType = 'default'
  @Output() defaultView = new EventEmitter<void>()
  @Output() guyDragEnd = new EventEmitter<LatLng>()

  @Select(OverlayState.getIsTraceImageExist) isTraceOverlayExist$: Observable<boolean>
  @Select(PicturesState.getLoading) pictureIsLoading$: Observable<boolean>
  @Select(UIState.getIsHoverTrace) isHoverTrace$: Observable<boolean>
  isHoverTrace = false
  isHoverSub: Subscription

  onGuyDrag = false

  mapDiv: HTMLElement
  isDrawing = false
  featuresSelected: GeoJSON.Feature[] = []

  selectionLayerGroup = layerGroup()
  onMouseDownPoint: any
  featuresSelectedLayer: any
  rectangleSelectionLayer: Rectangle

  constructor(private notification: NotificationService) {}

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
      case 'view':
        this.defaultView.emit()
        break
      default:
        this.tool = 'default'
    }
  }

  onGuyDragStart() {
    this.isHoverSub = this.isHoverTrace$.subscribe((isHover) => (this.isHoverTrace = isHover))
    this.mapDiv.addEventListener('mouseup', (event) => this.onGuyDragEnd(event))
    this.onGuyDrag = true
  }

  onGuyDragEnd(evt: MouseEvent) {
    if (this.onGuyDrag) {
      // If a layer of type trace image is onHover
      if (this.isHoverTrace) {
        const position = this.map.mouseEventToLayerPoint(evt)
        const point = this.map.layerPointToLatLng(position)
        this.guyDragEnd.emit(point)
      } else {
        this.notification.openSnackBar('Vous devez lâcher le personnage sur une trace image')
      }
      this.isHoverSub.unsubscribe()
      // FIX : removeEventListener doesn't work. That the reson why onGuyDrag exist but the mousup event still exist
      this.mapDiv.removeEventListener('mouseup', (event) => this.onGuyDragEnd(event))
      this.onGuyDrag = false
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
        const type = l['feature']['geometry']['type']
        const coord = l['feature']['geometry']['coordinates'][0]
        if (type === 'Point') {
          const pt = new LatLng(coord[1], coord[0])
          if (bbox.contains(pt)) {
            featuresSelected.push(featureModified)
          }
        } else if (type === 'MultiPolygon' || type === 'Polygon') {
          console.log('TODO: polygon')
        } else {
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
    this.mapDiv.removeEventListener('mouseup', (event) => this.onGuyDragEnd(event))
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
  ngOnDestroy() {
    this.removeAllEventListener()
    this.clearAll()
  }
}
