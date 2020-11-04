import { Component, Input, OnChanges, OnInit } from '@angular/core'
import { convertDegreesToRadians, MarzipanoService, ViewParams } from '../services/marzipano.service'

@Component({
  selector: 'app-panorama',
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
    `,
  ],
})
export class PanoramaComponent implements OnInit, OnChanges {
  @Input() image: string
  @Input() config: ViewParams

  viewer: any

  constructor(private marzipano: MarzipanoService) {}

  ngOnInit(): void {
    this.viewer = this.marzipano.initialize(document.querySelector('#viewer'))
    this.loadScene(this.image)
  }

  ngOnChanges(): void {
    this.loadScene(this.image)
  }

  private loadScene(image: string) {
    if (!this.config) {
      this.config = { yaw: 0, pitch: 0, fov: convertDegreesToRadians(65) }
    }
    if (!this.image) {
      this.image = 'http://192.168.0.147/pcrs/MdL/Photos_360/2019-12-31/stream_00007-000000_10851_0053305.jpg'
    }
    if (!this.viewer) {
      return
    }
    return this.marzipano.loadScene(this.viewer, image, this.config)
  }
}
