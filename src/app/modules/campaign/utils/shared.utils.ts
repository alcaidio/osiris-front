import { deburr } from 'lodash'

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

export const createFilters = (arr) => {
  const res = {}
  arr.map((e) => {
    const name = getValue(e.name)
    let val = []
    let count = 0
    e.values.map((v) => {
      if (v.checked) {
        const valueName = getValue(v.name)
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
