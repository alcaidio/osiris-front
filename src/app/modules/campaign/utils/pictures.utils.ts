// Note checkNavigation will be used for perfom navigation

const isInDirection = (a: number, b: number) => {
  return b >= a - 90 && b <= a + 90
}

const isInDirectionRight = (a: number, b: number) => {
  return b >= a && b <= a + 180
}

const isInDirectionLeft = (a: number, b: number) => {
  return b >= a - 180 && b <= a
}

export const checkNavigation = (direction: string, previous: number, current: number) => {
  switch (direction) {
    case 'front':
    case 'back':
      return isInDirection(previous, current)
    case 'front_right':
    case 'back_right':
      return isInDirectionRight(previous, current)
    case 'front_left':
    case 'back_left':
      return isInDirectionLeft(previous, current)
    default:
      console.log(`Direction "${direction}" is unknown.`)
  }
}
