import { google } from 'googleapis'
import { sheeez, toJSON } from './src/core'

const sheez1 = sheeez({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  token_path: 'token.json',
  creds_path: 'credentials.json',
  google,
})

//TODO: convert to promise
const read = sheez1.createRead(
  {
    spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
    range: 'A:G',
  },
  (err, res) => {
    if (err) return console.log('The API returned an error: ' + err)

    console.log('cb', res.data)
    // prints multi dimensional array representation of the grid data fromm sheets
    const rows = res.data.values

    // converts grid data to jsonlike object
    const toJson = toJSON(rows)

    const keys = toJson.map(item => {
      return {
        'Shipment No.:': item['Shipment No.:'],
        'Delivery Order No.:': item['Delivery Order No.:'],
      }
    })
  },
)

read()
