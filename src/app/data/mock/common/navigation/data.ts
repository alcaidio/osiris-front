/* tslint:disable:max-line-length */
import { TreoNavigationItem } from '@treo/components/navigation'

export const defaultNavigation: TreoNavigationItem[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    subtitle: 'Unique dashboard designs',
    type: 'group',
    icon: 'heroicons_outline:home',
    link: 'dashboard',
  },
]
// export const compactNavigation: TreoNavigationItem[] = [
//   {
//     id: 'dashboard',
//     title: 'Dashboard',
//     type: 'basic',
//     icon: 'heroicons_outline:chart-square-bar',
//     link: '/dashboard',
//   },
//   {
//     id: 'map',
//     title: 'Carte',
//     type: 'basic',
//     icon: 'heroicons_outline:location-marker',
//     link: '/map',
//   },
//   {
//     id: 'travaux',
//     title: 'Travaux',
//     type: 'basic',
//     icon: 'heroicons_outline:lightning-bolt',
//     link: '/works',
//   },
// ]
export const futuristicNavigation: TreoNavigationItem[] = [
  {
    id: 'starter.example',
    title: 'Example component',
    type: 'basic',
    icon: 'heroicons:chart-pie',
    link: '/example',
  },
  {
    id: 'starter.dummy.1',
    title: 'Dummy menu item #1',
    icon: 'heroicons:calendar',
    type: 'basic',
  },
  {
    id: 'starter.dummy.2',
    title: 'Dummy menu item #1',
    icon: 'heroicons:user-group',
    type: 'basic',
  },
]
export const horizontalNavigation: TreoNavigationItem[] = [
  {
    id: 'starter',
    title: 'Starter',
    type: 'group',
    icon: 'apps',
    children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
  },
]
