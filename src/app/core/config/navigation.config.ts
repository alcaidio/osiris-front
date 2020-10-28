import { TreoNavigationItem } from './../../../@treo/components/navigation/navigation.types'

// Other navigation params in src/app/data/mock/common/navigation/data.ts
// Navigation principale barre laterale gauche
export const compactNavigation: TreoNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/dashboard',
    },
    {
        id: 'maps',
        title: 'Cartes',
        type: 'aside',
        icon: 'mat_outline:map',
        children: [
            {
                id   : 'maps.diagnosis',
                title: 'Diagnostic',
                type : 'basic',
                icon : 'mat_outline:assessment',
                link : '/maps/diagnosis'
            },
            {
                id   : 'maps.imajbox',
                title: 'Imajebox',
                type : 'basic',
                icon : 'mat_outline:image',
                link : '/maps/imajebox', 
            },
            {
                id   : 'maps.imajebox',
                title: 'Roadview',
                type : 'basic',
                icon : 'mat_outline:360',
                link : '/maps/roadview',
            }
        ]
    },
    {
        id: 'travaux',
        title: 'Travaux',
        type: 'basic',
        icon: 'mat_outline:work_outline',
        link: '/works',
    }
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
