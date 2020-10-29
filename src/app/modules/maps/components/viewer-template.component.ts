import { Component, Input, Output, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'app-viewer-template',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./styles/maps.component.scss'],
  template: `
  <div class="content-layout fullwidth-basic-content-scroll">

    <div class="wrapper" >
      <div class="background">
        <div id="in-back" class="relative">
          <ng-content select="[background]"></ng-content>
        </div>
      </div>

      <div class="foreground">
        <div id="in-front" class="relative" *ngIf="!minimize">
          <ng-content select="[foreground]"></ng-content>
        </div>
        <div *ngIf="minimize">
          <ng-content select="[fab]"></ng-content>
        </div>
      </div>
    </div>  

  </div>
  `
})
export class ViewerTemplateComponent {
  @Input() minimize: boolean
}
