import { Shortcut } from 'app/layout/common/shortcuts/shortcuts.types'

/* tslint:disable:max-line-length */

export const shortcuts: Shortcut[] = [
  {
    id: '34fb28db-4ec8-4570-8584-2414d6de796b',
    label: 'Diagnosis',
    description: 'Votre diagnostique routier',
    icon: 'mat_outline:assessment',
    link: 'diagnosis',
    useRouter: true,
  },
  {
    id: '0a240ab8-e19d-4503-bf68-20013030d526',
    label: 'Image',
    description: 'Au plus proche de la réalité',
    icon: 'mat_outline:assessment',
    link: 'imajbox',
    useRouter: true,
  },
  {
    id: 'f5daf93e-b6f3-4199-8a0c-b951e92a6cb8',
    label: 'Accueil Immergis',
    description: 'De la réalité dans vos données',
    icon: 'business',
    link: 'http://immergis.fr/',
    useRouter: false,
  },
]
