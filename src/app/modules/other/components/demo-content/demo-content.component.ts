import { Component, ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'demo-sidebar-content',
  templateUrl: './demo-content.component.html',
  styleUrls: ['./demo-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DemoContentComponent {
  constructor() {}
}
