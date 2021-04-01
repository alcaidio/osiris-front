import { EntityStateModel } from '@ngxs-labs/entity-state'
import { Selector } from '@ngxs/store'
import { FiltersProp, Overlay } from '../../model/campaign.model'
import { cleanString } from '../../utils'
import { FilterState } from '../filters/filters.state'
import { transformKeyAndValue } from './../../utils/shared.utils'
import { OverlayState } from './overlays.state'

export class OverlaySelectors {
  @Selector([OverlayState, FilterState])
  static getFilteredOverlays(overlayState: EntityStateModel<Overlay>, filterState: EntityStateModel<FiltersProp>) {
    return Object.values(overlayState.entities)
      .map((overlay) => {
        const filters = filterState.entities[overlay.layerName].filters
        const filterKeys = Object.keys(filters)
        const filteredFeatures = overlay.features.filter((item) => {
          return filterKeys.every((key) => {
            const activeModel = overlay.featureTypeModel.find((e) => cleanString(e.keyName) === cleanString(key))
            if (
              filters[key].length === 0 ||
              !item.properties ||
              item.properties.length === 1 ||
              activeModel.propertyType === 'string' // ignore string type for filters
            ) {
              return true // ignore the filter
            } else {
              if (activeModel.propertyType === 'enum') {
                return filters[key].find((property) => cleanString(property) === cleanString(item['properties'][key]))
              } else if (activeModel.propertyType === 'number') {
                return filters[key].find((property) => {
                  const model = activeModel.propertyValues.find((m) => cleanString(m.keyName) === cleanString(property))
                  const { minValue, maxValue } = model
                  const val = +item['properties'][key]
                  return val >= minValue && val <= maxValue
                })
              } else if (activeModel.propertyType === 'date') {
                return filters[key].find((property) => {
                  const model = activeModel.propertyValues.find((m) => cleanString(m.keyName) === cleanString(property))
                  const { minValue, maxValue } = model
                  const date = item['properties'][key]
                  const val = new Date(date).getTime() / 1000
                  return val >= minValue && val <= maxValue
                })
              }
            }
          })
        })

        return { ...overlay, features: filteredFeatures }
      })
      .filter((o) => o.visible === true)
  }

  @Selector([OverlayState, OverlaySelectors.getFilteredOverlays])
  static getActiveFilteredOverlayProperties(state: EntityStateModel<Overlay>, filtered: Overlay[]) {
    const activeOverlay = filtered.find((f) => f.id === state.active)
    return activeOverlay.features.map((feature) => {
      const { diag_id, gid, ...others } = feature.properties

      const featureArrayWithCorrectDisplay = Object.entries(others).map((prop) =>
        transformKeyAndValue(prop[0], prop[1], activeOverlay.featureTypeModel)
      )

      const featureObjesctWithCorrectDisplay = featureArrayWithCorrectDisplay.reduce((acc, [k, v]) => {
        return { ...acc, [k]: v === null ? 'null' : v }
      }, {})

      return { featureId: feature.id, id: feature.properties.gid, ...featureObjesctWithCorrectDisplay }
    })
  }
}
