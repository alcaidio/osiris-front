import { TreoNavigationItem } from './../../../@treo/components/navigation/navigation.types'

// Other navigation params in src/app/data/mock/common/navigation/data.ts
// Navigation principale barre laterale gauche
export const compactNavigation: TreoNavigationItem[] = [
  {
    id: 'dashboard',
    title: 'core.navigation.dashboard',
    type: 'basic',
    icon: 'mat_outline:dashboard',
    link: '/dashboard',
  },
  {
    id: 'maps',
    title: 'core.navigation.maps',
    type: 'basic', // aside is possible
    icon: 'mat_outline:map',
    link: '/maps',
  },
  {
    id: 'works',
    title: 'core.navigation.works',
    type: 'basic',
    icon: 'mat_outline:work_outline',
    link: '/works',
  },
]

// Use in "src/app/data/mock/common/search/index.ts" for Search component
export const otherNavigation: Partial<TreoNavigationItem>[] = [
  {
    id: 'profile',
    title: 'Profil',
    subtitle: 'compte, profil, utilisateur',
    link: '/profile',
  },
  {
    id: 'settings',
    title: 'Paramètres',
    subtitle: 'settings, parametre, paramètres, configuration',
    link: '/settings',
  },
  {
    id: 'map.section',
    title: 'Information tronçon',
    subtitle: 'détail, detail, section, tronçon',
    link: '/map/section/1/infos',
  },
  {
    id: 'map.layers',
    title: 'Map layers',
    subtitle: 'filtre, layers, couches, map',
    link: '/map/layers',
  },
]
