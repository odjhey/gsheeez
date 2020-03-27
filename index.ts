import { google } from 'googleapis'
import { sheeez, createSchema, createModel } from './src/core'

const sheets = sheeez({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  token_path: 'token.json',
  creds_path: 'credentials.json',
  google,
})

const purchOrderSheet = sheets.create({
  spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
  range: 'A:G',
})

purchOrderSheet
  .grid( { headerLength: 1} )
  .then(data => {
    const schema = createSchema({
      range: purchOrderSheet.info.range,
      header: [
        'shipment',
        'delivery',
        'customer',
        'cust_name',
        'address',
        'qty',
        'sku',
      ],
    })

    const model = createModel(schema, data)
    console.log(model.getAll())
  })
  .catch(err => {
    console.error(err)
  })
