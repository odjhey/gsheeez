import { sheep } from '../src/core'

it('should be able to configure global sheez instance', () => {
  const config = {
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    token_path: 'token.json',
    creds_path: 'credentials.json',
    google: jest.fn(() => {}),
  }

  sheep.configure(config)
  expect(sheep.getConfig()).toEqual(config)

  const { sheep: sheep2 } = require('../src/core')
  expect(sheep2.getConfig()).toEqual(config)

})
