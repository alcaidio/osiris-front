import { TreoMockApiUtils } from './../../../../@treo/lib/mock-api/mock-api.utils'
import { MapCard } from './../../../modules/admin/maps/models/maps.model'

/* tslint:disable */
export const mapCards: MapCard[] = [
        {
                id: TreoMockApiUtils.guid(), 
                image: 'assets/images/pages/maps/map.png', 
                title: 'Diagnostic routier', 
                subtitle: 'Saint-Denis (94)',
                link: '/maps/diagnosis'
        }, 
        {
                id: TreoMockApiUtils.guid(), 
                image: 'assets/images/pages/maps/map.png', 
                title: 'Relevé Imajebox', 
                subtitle: 'Saint-Denis (94)',
                link: '/maps/image-bis'
        },
        {
                id: TreoMockApiUtils.guid(), 
                title: 'Example', 
                subtitle: 'Example map for demo',
                link: '/maps/image'
        }, 
        {
                id: TreoMockApiUtils.guid(), 
                title: 'Example 2', 
                subtitle: 'Example map 2 for demo',
                link: '/maps'
        }
]

