"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var read_1 = require("./read");
var schema_1 = require("./schema");
exports.createSchema = schema_1.createSchema;
var utils_1 = require("./utils");
exports.mergeSchema = utils_1.mergeSchema;
var model_1 = require("./model");
// TODO: ** this is for refactoring **//
var fs = require('fs');
var readline = require('readline');
// type TSheepling = {
//  grid: () => any
//  info: () => any
//  save: () => any
// }
var sheep = (function () {
    var hashFn = function (obj) { return obj; };
    var conf = {
        scopes: [],
        tokenPath: '',
        credsPath: '',
        token: '',
        creds: '',
        google: {},
        hashFn: function (obj) { return hashFn(obj); },
    };
    var configure = function (configuration) {
        conf = configuration;
        hashFn = configuration.hashFn;
    };
    var getConfig = function () { return conf; };
    var create = function (_info) {
        var info = _info;
        // const { scopes, tokenPath, credsPath, google } = conf
        var tokenPath = conf.tokenPath, credsPath = conf.credsPath, google = conf.google, token = conf.token, creds = conf.creds;
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
            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', function (code) {
                rl.close();
                oAuth2Client.getToken(code, function (err, token) {
                    if (err)
                        return reject(err);
                    oAuth2Client.setCredentials(token);
                    // Store the token to disk for later program executions
                    fs.writeFile(tokenPath, JSON.stringify(token), function (werr) {
                        if (werr)
                            return reject(werr);
                    });
                    callback(oAuth2Client);
                });
            });
        }
        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorizeWithFile(credentials, callback, reject) {
            var _a = credentials.installed, client_secret = _a.client_secret, client_id = _a.client_id, redirect_uris = _a.redirect_uris;
            /* eslint camelcase: 'off' */
            var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            // Check if we have previously stored a token.
            /* eslint consistent-return: 'off' */
            fs.readFile(tokenPath, function (err, token) {
                if (err)
                    return getNewToken(oAuth2Client, callback, reject);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }
        function authorizeWithObjs(_a, callback, reject) {
            var creds = _a.creds, token = _a.token;
            var _b = creds.installed, client_secret = _b.client_secret, client_id = _b.client_id, redirect_uris = _b.redirect_uris;
            /* eslint camelcase: 'off' */
            var oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            oAuth2Client.setCredentials(token);
            callback(oAuth2Client);
        }
        function authorize(credentials, callback, reject) {
            if (tokenPath) {
                return authorizeWithFile(credentials, callback, reject);
            }
            return authorizeWithObjs({ creds: credentials, token: token }, callback, reject);
        }
        var grid = function (options) {
            if (options === void 0) { options = { headerLength: 0 }; }
            var createExecCb = function (resolve, reject) { return function (auth) {
                var sheets = google.sheets({ version: 'v4', auth: auth });
                sheets.spreadsheets.values.get({
                    spreadsheetId: info.spreadsheetId,
                    range: info.sheet ? [info.sheet, info.range].join('!') : info.range,
                }, function (gerr, data) {
                    if (gerr)
                        return reject(gerr);
                    if (options.headerLength > 0) {
                        data.data.values.splice(0, options.headerLength);
                        resolve(data.data.values);
                    }
                    else {
                        resolve(data.data.values);
                    }
                });
            }; };
            return new Promise(function (resolve, reject) {
                if (credsPath) {
                    // Load client secrets from a local file.
                    fs.readFile(credsPath, function (err, content) {
                        if (err)
                            return reject(err);
                        // Authorize a client with credentials, then call the Google Sheets API.
                        authorize(JSON.parse(content), createExecCb(resolve, reject), reject);
                    });
                }
                else {
                    if (!creds) {
                        reject(new Error('Gsheet Credentials not found.'));
                        return;
                    }
                    authorize(creds, createExecCb(resolve, reject), reject);
                }
            });
        };
        var save = function (options, changes) {
            if (options === void 0) { options = {
                headerLength: 0,
            }; }
            var createExecCb = function (resolve, reject) { return function (auth) {
                var sheets = google.sheets({ version: 'v4', auth: auth });
                var requests = changes.map(function (change) {
                    var __metadata = change.__metadata;
                    var req = {
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
                    };
                    return req;
                });
                sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId: info.spreadsheetId,
                    requestBody: {
                        valueInputOption: 'USER_ENTERED',
                        data: requests,
                    },
                }, function (bUErr, res) {
                    if (bUErr)
                        return reject(bUErr);
                    resolve(res);
                });
            }; };
            return new Promise(function (resolve, reject) {
                if (credsPath) {
                    // Load client secrets from a local file.
                    fs.readFile(credsPath, function (err, content) {
                        if (err)
                            return reject(err);
                        // Authorize a client with credentials, then call the Google Sheets API.
                        authorize(JSON.parse(content), createExecCb(resolve, reject), reject);
                    });
                }
                else {
                    if (!creds) {
                        reject(new Error('Gsheet Credentials not found.'));
                        return;
                    }
                    authorize(creds, createExecCb(resolve, reject), reject);
                }
            });
        };
        return { grid: grid, info: info, save: save };
    };
    return { create: create, getConfig: getConfig, configure: configure };
})();
exports.sheep = sheep;
var hashFn = sheep.getConfig().hashFn;
var groupByKeys = read_1.default.groupByKeys;
exports.groupByKeys = groupByKeys;
var createModel = model_1.makeCreateModel(hashFn);
exports.createModel = createModel;
var createModelsFromBaseModel = model_1.makeCreateModelsFromBaseModel(hashFn);
exports.createModelsFromBaseModel = createModelsFromBaseModel;
var toJSONWithSchema = utils_1.makeToJSONWithSchema(hashFn);
exports.toJSONWithSchema = toJSONWithSchema;
