import read from './read'
import { createSchema, TSchema } from './schema'
import { makeToJSONWithSchema, mergeSchema } from './utils'
import { makeCreateModel, makeCreateModelsFromBaseModel } from './model'

// TODO: ** this is for refactoring **//
const fs = require('fs')
const readline = require('readline')

type TConfiguration = {
  scopes: Array<string>
  tokenPath: string
  credsPath: string
  google: any
  hashFn: (obj) => any
}

type TSheepInfo = {
  spreadsheetId: string
  range: string
  sheet?: string
}

type TSheep = {
  configure: (conf: TConfiguration) => void
  getConfig: () => TConfiguration
  create: (info: TSheepInfo) => any // TSheepling
}

// type TSheepling = {
//  grid: () => any
//  info: () => any
//  save: () => any
// }

const sheep: TSheep = (() => {
  let hashFn = (obj) => obj

  let conf: TConfiguration = {
    scopes: [],
    tokenPath: '',
    credsPath: '',
    google: {},
    hashFn: (obj) => hashFn(obj),
  }

  const configure = (configuration) => {
    conf = configuration
    hashFn = configuration.hashFn
  }

  const getConfig = () => conf

  const create = (_info) => {
    const info = _info
    // const { scopes, tokenPath, credsPath, google } = conf
    const { tokenPath, credsPath, google } = conf

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback, reject) {
      // const authUrl = oAuth2Client.generateAuthUrl({
      //   access_type: 'offline',
      //   scope: scopes,
      // })
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return reject(err)
          oAuth2Client.setCredentials(token)
          // Store the token to disk for later program executions
          fs.writeFile(tokenPath, JSON.stringify(token), (werr) => {
            if (werr) return reject(werr)
          })
          callback(oAuth2Client)
        })
      })
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback, reject) {
      const { client_secret, client_id, redirect_uris } = credentials.installed
      /* eslint camelcase: 'off' */
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
      )

      // Check if we have previously stored a token.
      /* eslint consistent-return: 'off' */
      fs.readFile(tokenPath, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback, reject)
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
      })
    }

    const grid = (options = { headerLength: 0 }): Promise<any> =>
      new Promise((resolve, reject) => {
        // Load client secrets from a local file.
        fs.readFile(credsPath, (err, content) => {
          if (err) return reject(err)
          // Authorize a client with credentials, then call the Google Sheets API.
          authorize(
            JSON.parse(content),
            (auth) => {
              const sheets = google.sheets({ version: 'v4', auth })
              sheets.spreadsheets.values.get(
                {
                  spreadsheetId: info.spreadsheetId,
                  range: info.sheet
                    ? [info.sheet, info.range].join('!')
                    : info.range,
                },
                (gerr, data) => {
                  if (gerr) return reject(gerr)

                  if (options.headerLength > 0) {
                    data.data.values.splice(0, options.headerLength)
                    resolve(data.data.values)
                  } else {
                    resolve(data.data.values)
                  }
                },
              )
            },
            reject,
          )
        })
      })

    const save = (
      options = {
        headerLength: 0,
      },
      changes,
    ): Promise<any> =>
      new Promise((resolve, reject) => {
        // Load client secrets from a local file.
        fs.readFile(credsPath, (err, content) => {
          if (err) return reject(err)
          // Authorize a client with credentials, then call the Google Sheets API.
          authorize(
            JSON.parse(content),
            (auth) => {
              const sheets = google.sheets({ version: 'v4', auth })
              const requests = changes.map((change) => {
                const { __metadata } = change
                const req = {
                  range: info.sheet
                    ? [
                        info.sheet,
                        __metadata.column +
                          (__metadata.rowIdx[0] + options.headerLength),
                      ].join('!')
                    : __metadata.column +
                      (__metadata.rowIdx[0] + options.headerLength),

                  majorDimension: 'COLUMNS',
                  values: [[change.value.to]],
                }

                return req
              })

              sheets.spreadsheets.values.batchUpdate(
                {
                  spreadsheetId: info.spreadsheetId,
                  requestBody: {
                    valueInputOption: 'USER_ENTERED',
                    data: requests,
                  },
                },
                (bUErr, res) => {
                  if (bUErr) return reject(bUErr)
                  resolve(res)
                },
              )
            },
            reject,
          )
        })
      })

    return { grid, info, save }
  }

  return { create, getConfig, configure }
})()

export { sheep }
export { TSchema }

const { hashFn } = sheep.getConfig()
const { groupByKeys } = read
const createModel = makeCreateModel(hashFn)
const createModelsFromBaseModel = makeCreateModelsFromBaseModel(hashFn)
const toJSONWithSchema = makeToJSONWithSchema(hashFn)

export { createSchema }
export { toJSONWithSchema }
export { groupByKeys }
export { createModel, createModelsFromBaseModel }
export { mergeSchema }
