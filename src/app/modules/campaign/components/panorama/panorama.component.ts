import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { MarzipanoService } from '../../services/marzipano.service'
import { convertDegreesToRadians } from '../../utils'
import { ViewParams } from './../../model/shared.model'

@Component({
  selector: 'app-panorama',
  templateUrl: './panorama.component.html',
  styleUrls: ['./panorama.component.scss'],
})
export class PanoramaComponent implements AfterViewInit, OnChanges {
  @Input() image: any
  @Input() config: ViewParams
  @Output() params = new EventEmitter<ViewParams>()
  viewer: any

  constructor(private marzipano: MarzipanoService, private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.viewer = this.marzipano.initialize(document.querySelector('#viewer'))

    // track if the viewer params change
    this.elRef.nativeElement.querySelector('#viewer').addEventListener('mousedown', () => {
      this.elRef.nativeElement.querySelector('#viewer').addEventListener('mouseup', this.onMouseMove.bind(this))
    })

    this.loadScene()
  }

  ngOnChanges(): void {
    if (this.viewer) {
      this.loadScene()
    }
  }

  private onMouseMove() {
    const params = this.marzipano.loadParams()
    this.params.emit(params)
  }

  private loadScene() {
    // Default config
    if (!this.config) {
      this.config = { yaw: 0, pitch: 0, fov: convertDegreesToRadians(65) }
    }
    // TODO default image
    if (!this.image) {
      this.image = 'http://192.168.0.147/pcrs/MdL/Photos_360/2019-12-31/stream_00007-000000_10851_0053305.jpg'
    }

    return this.marzipano.loadScene(this.viewer, this.image.path, this.config)
  }
}
