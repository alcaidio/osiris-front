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

  constructor() {}

  initialize(domElement: Element) {
    return new Viewer(domElement, {
      controls: {
        mouseViewMode: 'drag', // drag|qtvr
      }
    })
  }

  loadScene(viewer: Viewer, image: string, viewConfig: ViewParams) {
    const geometry = new EquirectGeometry([{ width: 1024 }, { width: 2048 }, { width: 4096 }])
    const source = ImageUrlSource.fromString(image)
    const view = new RectilinearView(viewConfig, RectilinearView.limit.vfov(
      convertDegreesToRadians(15), // max zoom
      convertDegreesToRadians(65) // min zoom
    ))
    
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
