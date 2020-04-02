import { createSchema } from '../src/core'
import { createModel, createModelsFromBaseModel } from '../src/core'

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

  it('should be able to create a model with delayed data pops', () => {
    const testSchema = heroSchema
    const heroModel = createModel(testSchema)

    const allHeroes = heroModel.getAll()
    expect(allHeroes).toEqual([])

    heroModel.setGrid(heroGrid)

    const allHeroesUpdated = heroModel.getAll()
    expect(allHeroesUpdated).toEqual([
      { Name: 'Slardar', Class: 'Roam', HP: '888', __metadata: { rowIdx: 1 } },
      { Name: 'Slark', Class: 'Agi', HP: '1', __metadata: { rowIdx: 2 } },
      { Name: 'King', Class: 'Fairy', HP: '99999', __metadata: { rowIdx: 3 } },
    ])

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

  it('should be able to read using a filter ', () => {
    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    const slardar = heroModel.get({ Name: 'Slardar' })

    expect(slardar).toEqual({
      Name: 'Slardar',
      Class: 'Roam',
      HP: '888',
      __metadata: { rowIdx: 1 },
    })
  })

  it('should be able to use a custom filter ', () => {
    const testSchema = heroSchema
    const heroModel = createModel(testSchema)
    heroModel.setGrid(heroGrid)

    const filtered = heroModel.filter((hero) => {
      return hero.Class == 'Agi' || hero.Name == 'King'
    })

    expect(filtered).toEqual([
      {
        Name: 'Slark',
        Class: 'Agi',
        HP: '1',
        __metadata: { rowIdx: 2 },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: 3 },
      },
    ])
  })

  it('should be able to create a multi level model', () => {
    const grid = [
      //     ['head', 'item', 'subitem'],
      ['h1', 'i1', 's1'],
      ['h1', 'i1', 's2'],
      ['h1', 'i2', 's1'],
      ['h2', 'i1', 's1'],
    ]

    const schema = createSchema({
      range: 'B:D',
      header: ['head', 'item', 'subitem'],
    })

    const model = createModel(schema, grid)

    const schemas = [
      createSchema({ range: 'B:B', header: ['head'] }),
      createSchema({ range: 'B:C', header: ['head', 'item'] }),
      createSchema({ range: 'B:D', header: ['head', 'item', 'subitem'] }),
    ]
    const models = createModelsFromBaseModel(schemas, model)
    const [hModel, iModel, sModel] = models

    expect(models.length).toBe(schemas.length)
    expect(hModel.getAll()).toMatchObject([{ head: 'h1' }, { head: 'h2' }])
    expect(iModel.getAll()).toMatchObject([
      { head: 'h1', item: 'i1' },
      { head: 'h1', item: 'i2' },
      { head: 'h2', item: 'i1' },
    ])
    expect(sModel.getAll()).toMatchObject([
      { head: 'h1', item: 'i1', subitem: 's1' },
      { head: 'h1', item: 'i1', subitem: 's2' },
      { head: 'h1', item: 'i2', subitem: 's1' },
      { head: 'h2', item: 'i1', subitem: 's1' },
    ])
  })

  it.todo('should be able to create a master data like model') //, () => { expect(false).toBe(true) })
  it.todo( 'should be able to read by uid' )//, () => { expect(false).toBe(true) })
})
