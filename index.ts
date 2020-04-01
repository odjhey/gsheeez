import { google } from 'googleapis'
import { sheep, createSchema, createModel } from './src/core'

sheep.configure({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  tokenPath: 'token.json',
  credsPath: 'credentials.json',
  google,
})

const purchOrderSheet = sheep.create({
  spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
  range: 'A:I',
})

purchOrderSheet
  .grid({ headerLength: 1 })
  .then((data) => {
    const schema = createSchema({
      range: purchOrderSheet.info.range,
      header: [
        'shipment',
        'delivery',
        'customer',
        'cust_name',
        'address',
        'qty',
        'itemno',
        'sku',
        'sku_name',
      ],
    })

    const model = createModel(schema)
    model
      .setGridRefresh(() => {
        return data
      })
      .then((nan) => {
        console.log(model.getAll())
      })
  })
  .catch((err) => {
    console.error(err)
  })

purchOrderSheet
  .grid({ headerLength: 1 })
  .then((data) => {
    const schema = createSchema({
      range: purchOrderSheet.info.range,
      header: [
        'shipment',
        'delivery',
        'customer',
        'cust_name',
        'address',
        'qty',
        'itemno',
        'sku',
        'sku_name',
      ],
    })

    const model = createModel(schema, data)

    const d1 = model.get({
      shipment: '5000000002',
      delivery: '3000000001',
    })
    model.update(d1, {
      qty: '20',
      sku_name: 'Syrup lang',
    })

    purchOrderSheet
      .save({ headerLength: 1 }, model.getChanges())
      .then((data) => {
        console.log('afterSave', data.status)
      })
      .catch((err) => console.log('err', err))
  })
  .catch((err) => {
    console.error(err)
  })
