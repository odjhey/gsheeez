import { sheep } from '../src/core'

describe('gsheet integ', () => {
  it('should be able to configure global sheez instance', () => {
    const config = {
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      tokenPath: 'token.json',
      credsPath: 'credentials.json',
      google: jest.fn(() => {}),
    }

    sheep.configure(config)
    expect(sheep.getConfig()).toEqual(config)

    const { sheep: sheep2 } = require('../src/core')
    expect(sheep2.getConfig()).toEqual(config)
  })

})
