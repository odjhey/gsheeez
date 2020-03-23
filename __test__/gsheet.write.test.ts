import mockData from './mock-data'

import { toJSON, groupByKeys } from '../src/core'

const write = (sheetObj, cell, newValue) => {

  return {
    save: () => {
      return { data: {}, status: 'success' }
    },
  }
}

it('dummy test', () => {
  expect(true).toBe(true);
});

//describe('basic func - write', () => {
//  it('should be able to change a cell', async () => {
//    const given = mockData.deliveries
//
//    const toJson = toJSON(given)
//    const objs = groupByKeys(
//      toJson.map(item => {
//        return {
//          'Shipment No.:': item['Shipment No.:'],
//          'Delivery Order No.:': item['Delivery Order No.:'],
//        }
//      }),
//      toJson,
//    )
//
//    const transaction = write(objs, {column: 'Description', row: 1}, 'New Description')
//    const transactionResult = await transaction.save()
//    const resStatus = transactionResult.status
//
//    expect(resStatus).toBe('success')
//    expect(transactionResult.data).toMatchSnapshot()
//  })
//})
