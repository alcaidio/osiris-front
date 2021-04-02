import { Overlay } from 'app/modules/campaign/model/campaign.model'

const groupByProps = (prop, data) => {
  return data.reduce((acc, curr) => {
    if (acc[curr[prop]] == null) {
      acc[curr[prop]] = []
    }
    acc[curr[prop]].push(curr)
    return acc
  }, {})
}

const allUniqFromArrByProp = (prop, data) => [...new Set(data.map((e) => e[prop]))]

const stateLengths = (dataGrouped, categories, prop, propToCalculate) => {
  return Object.entries(dataGrouped).map(([state, zones]) => {
    const arr = createDefaultArrWithAllZone(state, categories, propToCalculate)
    const unSortedByZone = [...(zones as any), ...arr].reduce((acc, curr) => {
      if (acc[curr[prop]] == null) {
        acc[curr[prop]] = 0
      }
      acc[curr[prop]] += +curr[propToCalculate]
      return acc
    }, {})
    const sortedByZone = orderedObjectByKey(unSortedByZone)
    delete sortedByZone.undefined
    return {
      name: state,
      data: Object.values(sortedByZone).map((v: number) => round(v / 1000)),
    }
  })
}

const createDefaultArrWithAllZone = (state, list, propToCalculate) => {
  const result = []
  list.map((prop) => {
    result.push({ prop: prop, state: state, [propToCalculate]: 0 })
  })
  return result
}

const orderedObjectByKey = (unorderedObj) => {
  const reducer = (obj, key) => {
    obj[key] = unorderedObj[key]
    return obj
  }
  return Object.keys(unorderedObj).sort().reduce(reducer, {})
}

export const round = (num: number) => Math.round(num * 100) / 100

export const transformDataForApexChart = (overlay: Overlay, propA: string, propB: string) => {
  const data = overlay.features.map((f: GeoJSON.Feature) => f.properties)
  const lengthPropKey = Object.keys(data[0]).find((e) => e.includes('length'))
  const grouped = orderedObjectByKey(groupByProps(propA, data))
  const categories = allUniqFromArrByProp(propB, data)
  const series = stateLengths(grouped, categories, propB, lengthPropKey)
  return { categories, series }
}
