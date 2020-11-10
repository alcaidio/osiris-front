import { Component, Input } from '@angular/core'
import { Drawer } from '../models'

// Template two
// |---------------------|------|
// |                     |      |
// |                     |      |
// |                     | side |
// |       drawer        |  nav |
// |                     |      |
// |                     |      |
// |                     |      |
// |---------------------|------|

@Component({
  selector: 'app-template-two',
  styleUrls: ['./_templates.component.scss'],
  template: `
    <div class="content-layout fullwidth-basic-content-scroll">
      <div class="wrapper">
        <mat-drawer-container class="overflow-hidden h-full">
          <!-- Drawer -->
          <mat-drawer [mode]="drawer.mode" [position]="drawer.position" [opened]="drawer.opened">
            <ng-content select="[sidenav]"></ng-content>
          </mat-drawer>

          <mat-drawer-content class="relative">
            <ng-content select="[content]"></ng-content>
          </mat-drawer-content>
        </mat-drawer-container>
      </div>
    </div>
  `,
})
export class TemplateTwoComponent {
  @Input() drawer: Drawer
}
