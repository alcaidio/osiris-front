import { deburr } from 'lodash'
import { StyleSet, TypeModel, TypeModelPropType } from './../model/campaign.model'
import { setDefaultStyleOfFeature } from './leaflet.utils'

export const filteredObjectByKeys = (obj: any, keys: any): any => {
  const allowed = keys
  const filtered = Object.keys(obj)
    .filter((key) => allowed.includes(key))
    .reduce((raw, key) => {
      raw[key] = obj[key]
      return raw
    }, {})
  return filtered
}

export const cleanString = (str: string): string => {
  // INPUT => "  Mon café est plein de caféïne "
  // OUTPUT => "mon_cafe_est_plein_de_cafeine"
  return deburr(str).trim().split(' ').join('_').toLowerCase()
}

const getValue = (value: any) => (typeof value === 'string' ? cleanString(value) : value)

export const filterPlainArray = (array: Array<any>, filters: Array<string>, node?: string): Array<any> => {
  const filterKeys = Object.keys(filters)
  return array.filter((item) => {
    // validates all filter criteria
    return filterKeys.every((key) => {
      // ignores an empty filter
      if (!filters[key].length) {
        return true
      }

      if (node) {
        return filters[key].find((filter: any) => getValue(filter) === getValue(item[node][key]))
      } else {
        return filters[key].find((filter: any) => getValue(filter) === getValue(item[key]))
      }
    })
  })
}

// filters example
// const filters = {
//   especes: ["platane", "peuplier"]
//   actions: ["a-elaguer"]
// };

export const createFilters = (arr: Array<any>) => {
  const res = {}
  arr.map((e: any) => {
    const name = getValue(e.keyName)
    let val = []
    let count = 0
    e.filterValues.map((v) => {
      if (v.checked) {
        const valueName = getValue(v.keyName)
        val = [...val, valueName]
        res[name] = val
        count++
      }
    })

    if (count === 0) {
      res[name] = []
    }
  })
  return res
}

const ratio = Math.PI / 180

export const convertDegreesToRadians = (degrees: number): number => {
  if (degrees <= 0 && degrees > 360) {
    throw new Error('Degrees must be between 0 and 360')
  } else {
    return degrees * ratio
  }
}
export const convertRadiansToDegrees = (radians: number): number => {
  if (radians <= 0 && radians > 6.28319) {
    throw new Error('Radians must be between 0 and 6.28319')
  } else {
    return radians / ratio
  }
}

export const compose = (f, g) => (x) => f(g(x))

export const transformKeyAndValue = (key: string, value: string, featureTypeModels: any) => {
  const curr = featureTypeModels.find((model) => cleanString(model.keyName) === cleanString(key))
  if (curr.propertyType === 'enum' && curr.propertyValues.length > 0) {
    const val = curr.propertyValues.find((v) => cleanString(v.keyName) === cleanString(value))?.displayName
    return [curr?.displayName, val, curr?.keyName]
  } else {
    return [curr.displayName, value, curr?.keyName]
  }
}

export const getFeatureStyle = (styleSet: StyleSet, typeModel: TypeModel, feature: GeoJSON.Feature) => {
  const propType = styleSet.propertyType as TypeModelPropType
  const value = feature.properties[styleSet.keyName.toLowerCase()]

  if (propType === 'enum') {
    const styles = styleSet.rules.find(
      (r) => cleanString(r.keyName) === cleanString(feature.properties[styleSet.keyName.toLowerCase()])
    )
    const { displayName, keyName, ...onlyStyle } = styles
    return onlyStyle
  } else if (propType === 'number') {
    const propValue = typeModel.propertyValues.find((m) => {
      return value >= m.minValue && value <= m.maxValue
    }).keyName
    const styles = styleSet.rules.find((r) => r.keyName === propValue)
    const { displayName, keyName, ...onlyStyle } = styles
    return onlyStyle
  } else if (propType === 'date') {
    const date = new Date(value).getTime() / 1000
    const propValue = typeModel.propertyValues.find((m) => {
      return date >= m.minValue && date <= m.maxValue
    }).keyName
    const styles = styleSet.rules.find((r) => r.keyName === propValue)
    const { displayName, keyName, ...onlyStyle } = styles
    return onlyStyle
  } else {
    const type = feature.geometry.type
    console.warn('No rule for style set (map.component.ts)')
    setDefaultStyleOfFeature(type)
  }
}
