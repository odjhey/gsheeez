import mockData from './mock-data'

import { toJSON, groupByKeys } from '../src/core'

const getGroupByKeys = toJson => {
  const grouped = groupByKeys(
    toJson.map(item => {
      return {
        'Shipment No.:': item['Shipment No.:'],
        'Delivery Order No.:': item['Delivery Order No.:'],
      }
    }),
    toJson,
  )

  return grouped
}

describe('basic gsheet functions -- read', () => {
  it('should be able to read from grid', () => {
    const givenDeliveries = mockData.deliveries
    expect(givenDeliveries.length > 0)
  })

  it('should convert grid to a json object', () => {
    const givenDeliveries = mockData.deliveries
    const res = toJSON(givenDeliveries)
    expect(res).toMatchSnapshot()
  })

  it('should get unique keys', () => {
    const givenDeliveries = mockData.deliveries

    const toJson = toJSON(givenDeliveries)
    const grouped = getGroupByKeys(toJson)

    expect(grouped).toMatchSnapshot()
  })

  it('should be able to get row addresses of grid by key', () => {
    const givenDeliveries = mockData.deliveries
    const toJson = toJSON(givenDeliveries)
    const grouped = getGroupByKeys(toJson)

    const row = getRowAddress(grouped, {
      'Shipment No.:': '5000000002',
      'Delivery Order No.:': '3000000001',
    })

    expect(row).toEqual([4, 5])
  })
})

const getRowAddress = (groupedSheetObj, keys) => {
  const filtered = groupedSheetObj.filter(fitem => {
    let isPass = true
    Object.keys(keys).forEach((key, index) => {
      if (keys[key] === fitem.key[key]) {
        //
      } else {
        isPass = false
      }
    })

    return isPass
  })

  const fil = filtered.map(obj => {
    return obj.items.map(item => item.rowIdx)
  })

  return fil.flat()
}
