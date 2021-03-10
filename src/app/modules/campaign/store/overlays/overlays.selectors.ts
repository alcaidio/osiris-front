import { EntityStateModel } from '@ngxs-labs/entity-state'
import { Selector } from '@ngxs/store'
import { cleanString } from '../../utils'
import { FilterState } from '../filters/filters.state'
import { FiltersProp, Overlay } from './../../model/shared.model'
import { OverlayState } from './overlays.state'

export class OverlaySelectors {
  @Selector([OverlayState, FilterState])
  static getFilteredOverlays(overlayState: EntityStateModel<Overlay>, filterState: EntityStateModel<FiltersProp>) {
    return Object.values(overlayState.entities)
      .map((overlay) => {
        const filters = filterState.entities[overlay.id].filters
        const filterKeys = Object.keys(filters)

        const filteredFeatures = overlay.features.filter((item) => {
          return filterKeys.every((key) => {
            if (filters[key].length === 0 || !item['properties']) {
              return true
            }

            if (item['properties']) {
              return filters[key].find((property) => {
                return cleanString(property) === cleanString(item['properties'][key])
              })
            }
          })
        })

        return { ...overlay, features: filteredFeatures }
      })
      .filter((o) => o.visible === true)
  }

  @Selector([OverlayState, OverlaySelectors.getFilteredOverlays])
  static getActiveFilteredOverlayProperties(state: EntityStateModel<Overlay>, filtered: Overlay[]) {
    return filtered
      .find((f) => f.id === state.active)
      .features.map((feature) => {
        return { featureId: feature.id, ...feature.properties }
      })
  }
}
