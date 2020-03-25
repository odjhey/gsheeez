import { createSchema } from '../src/core'
import { createModel } from '../src/core'

describe('utils - write ', () => {
  it('should be able to modify an obj property', () => {
    const heroGrid = [
      ['Slardar', 'Roam', '888'],
      ['Slark', 'Agi', '1'],
      ['King', 'Fairy', '99999'],
    ]
    const heroSchema = createSchema({
      range: 'B:D',
      header: ['Name', 'Class', 'HP'],
    })

    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    const fairy = heroModel.get({ Class: 'Fairy' })
    const newFairy = heroModel.update(fairy, { HP: '20' })

    //make sure to test that fairy is not modified
    expect(fairy).toMatchObject({
      Name: 'King',
      Class: 'Fairy',
      HP: '99999',
    })

    expect(newFairy).toMatchObject({
      Name: 'King',
      Class: 'Fairy',
      HP: '20',
    })
  })
})
