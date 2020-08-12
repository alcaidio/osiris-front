import { Injectable } from '@angular/core'
import { cloneDeep } from 'lodash-es'
import { TreoMockApi } from './../../../../@treo/lib/mock-api/mock-api.interfaces'
import { TreoMockApiService } from './../../../../@treo/lib/mock-api/mock-api.service'
import { baseMap as baseMapData, sections as sectionsData } from './data'

@Injectable({
  providedIn: 'root',
})
export class DiagnosticMockApi implements TreoMockApi {
  // type FeactureCollection
  private _sections: any
  private _baseMap: any

  /**
   * Constructor
   *
   * @param {TreoMockApiService} _treoMockApiService
   */
  constructor(private _treoMockApiService: TreoMockApiService) {
    // Set the data
    this._sections = sectionsData
    this._baseMap = baseMapData

    // Register the API endpoints
    this.register()
  }

  /**
   * Register
   */
  register(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Sections - GET
    // -----------------------------------------------------------------------------------------------------
    this._treoMockApiService.onGet('api/map/sections/all').reply(() => {
      const featureCollection = cloneDeep(this._sections)
      return [200, featureCollection.features]
    })

    // -----------------------------------------------------------------------------------------------------
    // @ Section - GET
    // -----------------------------------------------------------------------------------------------------
    this._treoMockApiService.onGet('api/map/sections/id').reply((request: any) => {
      // Get the id from the params
      const id = request.params.get('id')

      // Clone the sections
      const sections = cloneDeep(this._sections)

      // Find the section
      const section = sections.find((item: any) => item.id === id)

      return [200, section]
    })

    // -----------------------------------------------------------------------------------------------------
    // @ BaseMap - GET
    // -----------------------------------------------------------------------------------------------------
    this._treoMockApiService.onGet('api/map/base').reply(() => {
      return [200, cloneDeep(this._baseMap)]
    })
  }
}
