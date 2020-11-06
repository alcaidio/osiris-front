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
