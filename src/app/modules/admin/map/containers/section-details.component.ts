import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-section-details',
  template: `
    <div class="content-layout fullwidth-basic-inner-scroll">
      <!-- Main -->
      <div class="main p-4">
        {{ section | json }}
      </div>
    </div>
  `,
})
export class SectionDetailsComponent implements OnInit {
  @Input() section: any

  constructor() {}

  ngOnInit(): void {}
}
