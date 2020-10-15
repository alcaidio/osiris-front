import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types'

/* tslint:disable:max-line-length */

export const shortcuts: Shortcut[] = [
  {
    id: '34fb28db-4ec8-4570-8584-2414d6de796b',
    label: 'Map',
    description: 'Votre diagnostique routier',
    icon: 'map',
    link: 'map',
    useRouter: true,
  },
  {
    id: 'f5daf93e-b6f3-4199-8a0c-b951e92a6cb8',
    label: 'Site d\'Immergis',
    description: 'De la réalité dans vos données',
    icon: 'business',
    link: 'http://immergis.fr/',
    useRouter: false,
  },
  {
    id: '0a240ab8-e19d-4503-bf68-20013030d526',
    label: 'Reload',
    description: 'Relancer l\'application',
    icon: 'refresh',
    link: '',
    useRouter: false,
  },
]
