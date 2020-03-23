import { createSchema } from '../src/core'
import { createModel } from '../src/core'

const heroGrid = [
  ['Slardar', 'Roam', '888'],
  ['Slark', 'Agi', '1'],
  ['King', 'Fairy', '99999'],
]
const heroSchema = createSchema({
  range: 'B:D',
  header: ['Name', 'Class', 'HP'],
})

describe('Models', () => {
  it('should be able to create a model from a schema', () => {
    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    expect(heroModel).not.toBeUndefined()
  })

  it('should be able to read all data from a moodel', () => {
    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    const allHeroes = heroModel.getAll()

    expect(allHeroes).toEqual([
      { Name: 'Slardar', Class: 'Roam', HP: '888', __metadata: { rowIdx: 1 } },
      { Name: 'Slark', Class: 'Agi', HP: '1', __metadata: { rowIdx: 2 } },
      { Name: 'King', Class: 'Fairy', HP: '99999', __metadata: { rowIdx: 3 } },
    ])
  })
})
