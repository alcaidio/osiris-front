import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { MarzipanoService } from '../services/marzipano.service'
import { ViewParams } from './../services/marzipano.service'

@Component({
  selector: 'app-viewer',
  template: `
    <div class="wrapper">
      <div id="viewer"></div>
    </div>
  `,
  styles: [
    ` 
    .wrapper {
      height: 100%;
      width: 100%;
      z-index: 1;
    }
    #viewer {
      width: 100%;
      height: 100%;
    }
    `
  ]
})
export class ViewerComponent implements OnInit, OnChanges {
  @Input() image: string
  @Input() config: ViewParams
  viewer: any

  constructor(private marzipano: MarzipanoService) { }

  ngOnInit(): void {
    this.viewer = this.marzipano.initialize(document.querySelector('#viewer'))
    this.loadScene(this.image)
  }

  ngOnChanges(): void {
    this.loadScene(this.image)
  }

  private loadScene(image: string) {
    return this.marzipano.loadScene(
      this.viewer,
      image,
      this.config
    )
  }

}
