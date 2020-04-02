import { createSchema } from '../src/core'

import {
  makeCreateModel,
  makeCreateModelsFromBaseModel,
} from '../src/core/model'

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
  const hashFnMock = jest.fn((obj) => '1')
  const createModel = makeCreateModel(hashFnMock)
  const createModelsFromBaseModel = makeCreateModelsFromBaseModel(() => 2)

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
      {
        Name: 'Slardar',
        Class: 'Roam',
        HP: '888',
        __metadata: { rowIdx: [1], uid: '1' },
      },
      {
        Name: 'Slark',
        Class: 'Agi',
        HP: '1',
        __metadata: { rowIdx: [2], uid: '1' },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: [3], uid: '1' },
      },
    ])

    expect(heroModel).not.toBeUndefined()
  })

  it('should be able to read all data from a moodel', () => {
    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    const allHeroes = heroModel.getAll()

    expect(allHeroes).toEqual([
      {
        Name: 'Slardar',
        Class: 'Roam',
        HP: '888',
        __metadata: { rowIdx: [1], uid: '1' },
      },
      {
        Name: 'Slark',
        Class: 'Agi',
        HP: '1',
        __metadata: { rowIdx: [2], uid: '1' },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: [3], uid: '1' },
      },
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
      __metadata: { rowIdx: [1], uid: '1' },
    })
  })

  it('should be able to assign UID via schema keys ', () => {
    const hashFnMock = jest.fn((obj) => {
      if (obj === JSON.stringify({ Name: 'Slardar' })) {
        return 'slz8'
      }
      if (obj === JSON.stringify({ Name: 'Slark' })) {
        return 'slar'
      }
      if (obj === JSON.stringify({ Name: 'King' })) {
        return 'kinz'
      }
      return 8
    })
    const createModel = makeCreateModel(hashFnMock)

    const testSchema = createSchema({
      range: 'B:D',
      header: ['Name', 'Class', 'HP'],
      keys: ['Name'],
    })

    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)
    const allHero = heroModel.getAll()

    expect(allHero).toEqual([
      {
        Name: 'Slardar',
        Class: 'Roam',
        HP: '888',
        __metadata: { rowIdx: [1], uid: 'slz8' },
      },
      {
        Name: 'Slark',
        Class: 'Agi',
        HP: '1',
        __metadata: { rowIdx: [2], uid: 'slar' },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: [3], uid: 'kinz' },
      },
    ])
  })

  it('should be able to read using an id ', () => {
    const hashFnMock = jest.fn((obj) => {
      if (obj === JSON.stringify({ Name: 'Slardar' })) {
        return 'slz8'
      }
      return 2
    })
    const createModel = makeCreateModel(hashFnMock)

    const testSchema = createSchema({
      range: 'B:D',
      header: ['Name', 'Class', 'HP'],
      keys: ['Name'],
    })

    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    const slardar = heroModel.getById('slz8')

    expect(slardar).toEqual({
      Name: 'Slardar',
      Class: 'Roam',
      HP: '888',
      __metadata: { rowIdx: [1], uid: 'slz8' },
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
        __metadata: { rowIdx: [2], uid: '1' },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: [3], uid: '1' },
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

  it('should be able to suport multiple rowIdxes', () => {
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
      createSchema({ range: 'B:B', header: ['head'], keys: ['head'] }),
      createSchema({ range: 'B:C', header: ['head', 'item'] }),
      createSchema({ range: 'B:D', header: ['head', 'item', 'subitem'] }),
    ]
    const models = createModelsFromBaseModel(schemas, model)
    const [hModel] = models

    expect(models.length).toBe(schemas.length)
    expect(hModel.getAll()).toEqual([
      {
        head: 'h1',
        __metadata: {
          uid: 2,
          rowIdx: [1, 2, 3],
        },
      },
      {
        head: 'h2',
        __metadata: {
          uid: 2,
          rowIdx: [4],
        },
      },
    ])
    //    expect(iModel.getAll()).toEqual([
    //      { head: 'h1', item: 'i1' },
    //      { head: 'h1', item: 'i2' },
    //      { head: 'h2', item: 'i1' },
    //    ])
    //    expect(sModel.getAll()).toEqual([
    //      { head: 'h1', item: 'i1', subitem: 's1' },
    //      { head: 'h1', item: 'i1', subitem: 's2' },
    //      { head: 'h1', item: 'i2', subitem: 's1' },
    //      { head: 'h2', item: 'i1', subitem: 's1' },
    //    ])
  })

  it('should be able to suport update of multiple rowIdx', () => {
    const grid = [
      //     ['head', 'item', 'subitem'],
      ['h1', 'hh', 'i1', 's1'],
      ['h1', 'hh', 'i1', 's2'],
      ['h1', 'hh', 'i2', 's1'],
      ['h2', 'beu', 'i1', 's1'],
    ]

    const schema = createSchema({
      range: 'B:E',
      header: ['head', 'hh', 'item', 'subitem'],
    })

    const model = createModel(schema, grid)

    const schemas = [
      createSchema({ range: 'B:C', header: ['head', 'hh'], keys: ['head'] }),
      createSchema({
        range: 'B:D',
        header: ['head', 'hh', 'item'],
        keys: ['head', 'item'],
      }),
    ]

    const models = createModelsFromBaseModel(schemas, model)
    const [hModel] = models

    const h1 = hModel.get({ head: 'h1' })

    hModel.update(h1, { hh: 'nah' })

    const changes = hModel.getChanges()

    expect(changes).toEqual([
      {
        fieldname: 'hh',
        value: { from: 'hh', to: 'nah' },
        __metadata: { rowIdx: [1], column: 'C' },
      },
      {
        fieldname: 'hh',
        value: { from: 'hh', to: 'nah' },
        __metadata: { rowIdx: [2], column: 'C' },
      },
      {
        fieldname: 'hh',
        value: { from: 'hh', to: 'nah' },
        __metadata: { rowIdx: [3], column: 'C' },
      },
    ])
  })
})

describe('metadata of row values', () => {
  const hashFnMock = jest.fn((obj) => 3)
  const createModel = makeCreateModel(hashFnMock)

  it('should be able to generate correct sequence of metadata', () => {
    const testSchema = heroSchema
    const heroes = heroGrid
    const heroModel = createModel(testSchema, heroes)

    expect(heroModel.getAll()).toEqual([
      {
        Name: 'Slardar',
        Class: 'Roam',
        HP: '888',
        __metadata: { rowIdx: [1], uid: 3 },
      },
      {
        Name: 'Slark',
        Class: 'Agi',
        HP: '1',
        __metadata: { rowIdx: [2], uid: 3 },
      },
      {
        Name: 'King',
        Class: 'Fairy',
        HP: '99999',
        __metadata: { rowIdx: [3], uid: 3 },
      },
    ])
  })
})
