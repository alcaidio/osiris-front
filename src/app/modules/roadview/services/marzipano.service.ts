import { Injectable } from '@angular/core'
import { EquirectGeometry, ImageUrlSource, RectilinearView, Viewer } from 'marzipano'
import { ViewParams } from './../models/panorama.model'
import { convertDegreesToRadians } from './../utils/conversion.util'

@Injectable()
export class MarzipanoService {
  viewer: any

  constructor() {}

  initialize(domElement: Element) {
    return new Viewer(domElement, {
      controls: {
        mouseViewMode: 'drag', // drag|qtvr
      },
    })
  }

  loadScene(viewer: Viewer, image: string, viewConfig: ViewParams) {
    const geometry = new EquirectGeometry([{ width: 1024 }, { width: 2048 }, { width: 4096 }])
    const source = ImageUrlSource.fromString(image)
    const view = new RectilinearView(
      viewConfig,
      RectilinearView.limit.vfov(
        convertDegreesToRadians(15), // max zoom
        convertDegreesToRadians(65) // min zoom
      )
    )

    const scene = viewer.createScene({
      source,
      geometry,
      view,
    })

    // keep the config of the last view
    view.setYaw(viewConfig.yaw)
    view.setPitch(viewConfig.pitch)
    view.setFov(viewConfig.fov)

    scene.switchTo({
      transitionDuration: 2500,
    })

    return scene
  }
}
