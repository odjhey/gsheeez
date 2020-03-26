import { createSchema } from '../../src/core'
import { createModel } from '../../src/core'

const save = async (changes, fSave) => {
  fSave(changes)
}

//const gsheetValGet = params => {
//  await sheets.spreadsheets.values.get(
//    {
//      spreadsheetId: params.spreadsheetId,
//      range: params.range,
//    }
//  )
//}

const mockSave = jest.fn(async () => {})

describe('gsheet', () => {
  it('should call save', async () => {
    const heroGrid = [
      ['Slardar', 'Roam', '888'],
      ['Slark', 'Agi', '1'],
      ['King', 'Fairy', '99999'],
    ]
    const heroSchema = createSchema({
      range: 'B:D',
      header: ['Name', 'Class', 'HP'],
    })

    const heroes = heroGrid
    const heroModel = createModel(heroSchema, heroes)

    const fairy = heroModel.get({ Class: 'Fairy' })
    const newFairy = heroModel.update(fairy, { HP: '20' })

    await save(heroModel.getChanges(), mockSave)

    expect(mockSave.mock.calls.length).toBe(1)
  })
})
