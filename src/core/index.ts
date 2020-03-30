import read from './read'
import { createSchema, toJSONWithSchema } from './schema'
import { createModel } from './model'
import { toJSON } from '../helpers'

const { groupByKeys } = read

export { createSchema }
export { toJSONWithSchema }
export { groupByKeys }
export { createModel }
export { toJSON }

//TODO: ** this is for refactoring **//
const fs = require('fs')
const readline = require('readline')
const util = require('util')

const sheeez = conf => {
  const { scopes, token_path, creds_path, google } = conf

  const create = _info => {
    const info = _info

    const grid = (options = { headerLength: 0 }): Promise<any> => {
      return new Promise((resolve, reject) => {
        // Load client secrets from a local file.
        fs.readFile(creds_path, (err, content) => {
          if (err) return reject(err)
          // Authorize a client with credentials, then call the Google Sheets API.
          authorize(
            JSON.parse(content),
            auth => {
              const sheets = google.sheets({ version: 'v4', auth })
              sheets.spreadsheets.values.get(
                {
                  spreadsheetId: info.spreadsheetId,
                  range: info.range,
                },
                (err, data) => {
                  if (err) return reject(err)

                  if (options.headerLength > 0) {
                    const header = data.data.values.splice(
                      0,
                      options.headerLength,
                    )
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
    }

    const save = (
      options = {
        headerLength: 0,
      },
      changes,
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        // Load client secrets from a local file.
        fs.readFile(creds_path, (err, content) => {
          if (err) return reject(err)
          // Authorize a client with credentials, then call the Google Sheets API.
          authorize(
            JSON.parse(content),
            auth => {
              const sheets = google.sheets({ version: 'v4', auth })
              const requests = changes.map(change => {
                const { __metadata } = change
                const req = {
                  range:
                    __metadata.column +
                    (__metadata.rowIdx + options.headerLength),
                  majorDimension: 'COLUMNS',
                  values: [[change.value.to]],
                }
                console.log('req', req)
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
                (err, res) => {
                  if (err) return reject(err)
                  resolve(res)
                },
              )
            },
            reject,
          )
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
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0],
      )

      // Check if we have previously stored a token.
      fs.readFile(token_path, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback, reject)
        oAuth2Client.setCredentials(JSON.parse(token))
        callback(oAuth2Client)
      })
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback, reject) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
      })
      console.log('Authorize this app by visiting this url:', authUrl)
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
      rl.question('Enter the code from that page here: ', code => {
        rl.close()
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return reject(err)
          oAuth2Client.setCredentials(token)
          // Store the token to disk for later program executions
          fs.writeFile(token_path, JSON.stringify(token), err => {
            if (err) return reject(err)
            console.log('Token stored to', token_path)
          })
          callback(oAuth2Client)
        })
      })
    }

    return { grid, info, save }
  }
  return { create }
}

export { sheeez }
