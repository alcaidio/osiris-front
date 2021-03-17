import { Injectable } from '@angular/core'
import { EquirectGeometry, ImageUrlSource, RectilinearView, Viewer } from 'marzipano'
import { ViewParams } from '../model/shared.model'
import { compose, convertDegreesToRadians } from '../utils'

@Injectable()
export class MarzipanoService {
  viewer: any
  view: any

  defaultViewerOptions = {
    controls: {
      mouseViewMode: 'drag', // drag|qtvr
    },
  }
  defaultSceneLevels = [{ width: 1024 }, { width: 2048 }, { width: 4096 }, { width: 8192 }, { width: 16384 }]
  limiters = compose(
    RectilinearView.limit.vfov(
      convertDegreesToRadians(12), // max zoom
      convertDegreesToRadians(65) // min zoom
    ),
    RectilinearView.limit.pitch(
      convertDegreesToRadians(-35), // max pitch angle
      convertDegreesToRadians(25) // min pitch angle
    )
  )

  constructor() {}

  initialize(domElement: Element) {
    return new Viewer(domElement, this.defaultViewerOptions)
  }

  loadScene(viewer: Viewer, image: string, viewConfig: ViewParams) {
    const geometry = new EquirectGeometry(this.defaultSceneLevels)
    const source = ImageUrlSource.fromString(image)
    this.view = new RectilinearView(viewConfig, this.limiters)

    const scene = viewer.createScene({
      source,
      geometry,
      view: this.view,
    })

    // keep the config of the last view
    this.view.setYaw(viewConfig.yaw)
    this.view.setPitch(viewConfig.pitch)
    this.view.setFov(viewConfig.fov)

    scene.switchTo({
      transitionDuration: 2500,
    })

    return scene
  }

  loadParams() {
    return this.view.parameters()
  }
}
