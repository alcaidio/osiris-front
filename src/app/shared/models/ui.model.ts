export enum CursorStyle {
  AUTO = 'auto',
  DEFAULT = 'default',
  NONE = 'none',
  HELP = 'help',
  POINTER = 'pointer',
  PROGRESS = 'progress',
  WAIT = 'wait',
  CROSSHAIR = 'crosshair',
  COPY = 'copy',
  MOVE = 'move',
  ZOOMIN = 'zoom-in',
  ZOOMOUT = 'zoom-out',
  GRAB = 'grab',
  GRABIN = 'grabbin',
}

export type DrawerMode = 'over' | 'push' | 'side'

export type DrawerPosition = 'start' | 'end'

export interface Drawer {
  mode: DrawerMode
  position: DrawerPosition
  opened: boolean
}
