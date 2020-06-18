require('dotenv').config()

import { google } from 'googleapis'
import { sheep, createSchema, createModel } from 'gsheeez'
import { MD5 } from 'crypto-js'

const { credentials, token } = process.env
console.log({credentials, token})

sheep.configure({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  creds: JSON.parse(credentials),
  token: JSON.parse(token),
  google,
  hashFn: (obj) => {
    return MD5(obj).toString()
  },
})

const purchOrderSheet = sheep.create({
  spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
  range: 'A:I',
  sheet: 'Sheet3'
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
      keys: ['shipment', 'delivery', 'itemno']
    })

    const model = createModel(schema)
    model
      .setGridRefresh(() => {
        return data
      })
      .then((nan) => {
        console.log(model.getAll())
        console.log('try get by ID', model.getById( '45ad3495585fcb0cf6008112b860b742' ))
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
      shipment: '5000000444',
      delivery: '3000000001',
    })

    console.log('d1', d1)

    model.update(d1, {
      qty: '891',
      sku_name: 'sheet3',
    })

    console.log(model.getChanges())

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
