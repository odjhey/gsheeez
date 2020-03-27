import { google } from 'googleapis'
import { sheeez } from './src/core'

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
  .grid()
  .then((resp: any) => {
    console.log(resp.data)
  })
  .catch(err => {
    console.error(err)
  })
