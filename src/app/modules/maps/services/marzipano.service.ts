import { Injectable } from '@angular/core'
import { EquirectGeometry, ImageUrlSource, RectilinearView, Viewer } from 'marzipano'

///////// Utils 
const ratio = Math.PI / 180

export const convertDegreesToRadians = (degrees: number): number => {
  if (degrees <= 0 && degrees > 360) {
    throw new Error('Degrees must be between 0 and 360')
  } else {
    return degrees * ratio
  }
}
export const convertRadiansToDegrees = (radians: number): number => {
  if (radians <= 0 && radians > 6.28319) {
    throw new Error('Radians must be between 0 and 6.28319')
  } else {
    return radians / ratio
  }
}

///////// Models 
export interface ViewParams {
  fov: number
  pitch: number
  roll?: number
  yaw: number
}


@Injectable({
  providedIn: 'root'
})
export class MarzipanoService {
  viewer: any
  view: any
  defaultViewerOptions = {
    controls: {
      mouseViewMode: 'drag', // drag|qtvr
    },
  }
  defaultSceneLevels = [{ width: 1024 }, { width: 2048 }, { width: 4096 }]
  limiter = RectilinearView.limit.vfov(
    convertDegreesToRadians(10), // max zoom
    convertDegreesToRadians(65) // min zoom
  )

  constructor() {}

  initialize(domElement: Element, options = this.defaultViewerOptions) {
    return new Viewer(domElement, options)
  }

  loadScene(viewer: Viewer, image: string, viewConfig: ViewParams) {
    const geometry = new EquirectGeometry(this.defaultSceneLevels)
    const source = ImageUrlSource.fromString(image)
    this.view = new RectilinearView(viewConfig, this.limiter)
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
}
