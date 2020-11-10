import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-buildings-layer',
  template: `
    <mgl-layer
      *ngIf="visible"
      id="3d-buildings"
      source="composite"
      sourceLayer="building"
      [filter]="['==', 'extrude', 'true']"
      type="fill-extrusion"
      [minzoom]="minZoom"
      [paint]="{
        'fill-extrusion-color': color,
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], minZoom, 0, 15.15, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], minZoom, 0, 15.15, ['get', 'min_height']],
        'fill-extrusion-opacity': opacity
      }"
    ></mgl-layer>
  `,
})
export class BuildingsLayerComponent {
  @Input() visible: boolean
  @Input() color = '#aaa'
  @Input() opacity = 0.65
  @Input() minZoom = 12
}
