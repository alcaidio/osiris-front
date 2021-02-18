import { animate, state, style, transition, trigger } from '@angular/animations'

export const slide = trigger('slide', [
  state('0', style({ opacity: 0.2, width: '0' })),
  state('1', style({ opacity: 1, width: '100%' })),
  transition('0 => 1', animate('1000ms ease')),
  transition('1 => 0', animate('800ms ease')),
])

export const slideHeight = trigger('slideHeight', [
  state('0', style({ opacity: 0.2, height: '0' })),
  state('1', style({ opacity: 1, height: '*' })),
  transition('0 => 1', animate('400ms ease')),
  transition('1 => 0', animate('300ms ease')),
])

export const OsirisAnimations = [slide, slideHeight]
