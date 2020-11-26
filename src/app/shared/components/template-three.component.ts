import { Component } from '@angular/core'

// Template three
// |--------------|-------------|
// |              |             |
// |              |             |
// |  left side   |  right side |
// |              |             |
// |              |             |
// |              |             |
// |              |             |
// |--------------|-------------|

@Component({
  selector: 'app-template-three',
  template: `
    <div class="content-layout fullwidth-basic-content-scroll">
      <div class="wrapper-three flex bg-gray-100 min-h-full">
        <div class="w-1/3 h-full border-r-4 border-gray-400 z-50">
          <ng-content select="[left]"></ng-content>
        </div>
        <div class="w-2/3">
          <ng-content select="[right]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .wrapper-three {
        height: calc(100vh - 64px) !important;
        position: relative;
        overflow: hidden !important;
      }
    `,
  ],
})
export class TemplateThreeComponent {}
