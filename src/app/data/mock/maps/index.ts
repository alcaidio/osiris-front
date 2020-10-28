import { Injectable } from '@angular/core'
import { TreoMockApi } from 'app/../@treo/lib/mock-api/mock-api.interfaces'
import { TreoMockApiService } from 'app/../@treo/lib/mock-api/mock-api.service'
import { MapCard } from 'app/modules/maps/models/maps.model'
import { cloneDeep } from 'lodash-es'
import { mapCards as mapCardsData } from './data'

@Injectable({
  providedIn: 'root',
})
export class MapListMockApi implements TreoMockApi {
  private _mapCards: MapCard[]

  constructor(private _treoMockApiService: TreoMockApiService) {
    // Set the data
    this._mapCards = mapCardsData

    // Register the API endpoints
    this.register()
  }


  register(): void {

        this._treoMockApiService.onGet('api/maps/all').reply(() => {
                return [200, cloneDeep(this._mapCards)]
        })

        this._treoMockApiService.onGet('api/maps/id').reply((request: any) => {
      // Get the id from the params
      const id = request.params.get('id')

      // Clone the sections
      const mapCards = cloneDeep(this._mapCards)

      // Find the section
      const mapCard = mapCards.find((item: MapCard) => item.id === id)

      return [200, mapCard]
    })

  }
}
