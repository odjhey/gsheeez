const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err,
        );
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
      range: 'A:O',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;

      const toJson = toJSON(rows);

      const grouped = groupByKeys(
        toJson.map(item => {
          return {
            'Shipment No.:': item['Shipment No.:'],
            'Delivery Order No.:': item['Delivery Order No.:'],
          };
        }),
        toJson,
      );
    },
  );

  sheets.spreadsheets.values.update(
    {
      spreadsheetId: '1ux7ttNVuTbMaIfcW4t8tZe9Ii17F-3khXjHR8Il2dGI',
      range: 'O',
      valueInputOption: 'USER_ENTERED',
      value: ['1', null, 'halakata'],
    },
    (err, res) => {
      console.log('update ---------');
      if (err) return console.log('The API returned an error: ' + err);
      console.log(res);
    },
  );
}

//reduce
function reduceToJSON() {
  //TODO
}

function toJSON(rows) {
  //convert to json obj, header = idx 0
  let toJson = [];
  let header = [];
  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      header = row;
    } else {
      let lineObj = {};

      header.forEach((field, col) => {
        lineObj[header[col]] = row[col];
      });
      toJson.push(lineObj);
    }
  });

  return toJson;
}

function groupByKeys(keys, data) {
  //const distinctKeys = [ ...new Set(keys)]
  const distinctKeys = keys.reduce((collector = [], item) => {
    if (
      collector.filter(citem => {
        if (JSON.stringify(citem) === JSON.stringify(item)) {
          return true;
        }
      }).length === 0
    ) {
      collector.push(item);
    }

    return collector;
  }, []);

  const complete = distinctKeys.map(itemKey => {
    const c = {
      key: itemKey,
      items: data.filter(fitem => {
        let isPass = true;
        Object.keys(itemKey).forEach((key, index) => {
          if (itemKey[key] === fitem[key]) {
            //
          } else {
            isPass = false;
          }
        });

        return isPass;
      }),
    };
    return c;
  });

  return complete;

  //    const fullDistincKeys = distinctKeys.map(item => {
  //        data.filter( d => {
  //          d[keys]
  //        })
  //    })
}
