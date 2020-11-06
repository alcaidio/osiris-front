import { TreoMockApiUtils } from 'app/../@treo/lib/mock-api/mock-api.utils'
import { MapCard } from 'app/shared/models/maps.model'

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
                image: 'assets/images/pages/maps/map2.png', 
                title: 'Relevé Imajebox', 
                subtitle: 'Saint-Denis (94)',
                link: '/maps/roadview'
        },
        {
                id: TreoMockApiUtils.guid(), 
                title: 'Example', 
                subtitle: 'Example map for demo',
                link: '/maps/imajbox'
        }, 
        {
                id: TreoMockApiUtils.guid(), 
                title: 'Example 2', 
                subtitle: 'Example map 2 for demo',
                link: '/maps'
        }
]

