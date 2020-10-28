import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-buildings',
  template: `
    <ng-container *ngIf="visible">
      <mgl-layer
        id="3d-buildings"
        source="composite"
        sourceLayer="building"
        [filter]="['==', 'extrude', 'true']"
        type="fill-extrusion"
        [minzoom]="minZoom"
        [paint]="{
          'fill-extrusion-color': color,
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.15, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.15, ['get', 'min_height']],
          'fill-extrusion-opacity': opacity
        }"
      ></mgl-layer>
    </ng-container>
  `
})
export class BuildingsComponent {
  @Input() visible = false
  @Input() color = '#aaa'
  @Input() opacity = 0.70
  @Input() minZoom = 14
}
