import { createSchema } from '../src/core'
import {
  makeCreateModel,
  makeCreateModelsFromBaseModel,
} from '../src/core/model'

import { mergeSchema } from '../src/core'

describe('schema utilities', () => {
  const hashFnMock = jest.fn((obj) => '1')
  const createModel = makeCreateModel(hashFnMock)
  const createModelsFromBaseModel = makeCreateModelsFromBaseModel(hashFnMock)

  it('should be able to merge schemas', () => {
    const schema1 = createSchema({
      range: 'B:D',
      header: ['Field1', 'Field2', 'Field3'],
    })
    const schema2 = createSchema({
      range: 'X:Y',
      header: ['An1', 'An2'],
    })
    const schema3 = createSchema({
      range: 'E:E',
      header: ['ESing'],
    })

    const schema = mergeSchema([schema1, schema2, schema3])

    expect(schema).toMatchObject([
      {
        key: 'Field1',
        __metadata: { column: 'B', idx: 0, isUniqueIdfier: true },
      },
      {
        key: 'Field2',
        __metadata: { column: 'C', idx: 1, isUniqueIdfier: true },
      },
      {
        key: 'Field3',
        __metadata: { column: 'D', idx: 2, isUniqueIdfier: true },
      },
      {
        key: 'An1',
        __metadata: { column: 'X', idx: 3, isUniqueIdfier: true },
      },
      {
        key: 'An2',
        __metadata: { column: 'Y', idx: 4, isUniqueIdfier: true },
      },
      {
        key: 'ESing',
        __metadata: { column: 'E', idx: 5, isUniqueIdfier: true },
      },
    ])
  })
  it('should be able to create a model from a Merged schema', () => {
    const baseGrid = [
      ['Slardar', 'Slytherin', 'Dotes', 'MOBA', 'PC', '888'],
      ['Slark', 'Frog', 'Dotes', 'MOBA', 'PC', '1'],
      ['King', 'Fairy', '7DS', 'RPG?', 'Mobile', '99999'],
      ['Exia', 'Angel', 'Arknights', 'TD', 'Mobile', '9'],
    ]
    const baseSchema = createSchema({
      range: 'B:F',
      header: ['name', 'class', 'game', 'game_type', 'platform'],
    })

    const baseModel = createModel(baseSchema, baseGrid)

    const schema1 = createSchema({
      range: 'B:B',
      header: ['name'],
    })
    const schema2 = createSchema({
      range: 'D:E',
      header: ['game', 'game_type'],
    })
    const schema3 = createSchema({
      range: 'C:C',
      header: ['class'],
    })

    const schema = mergeSchema([schema1, schema2, schema3])

    const [model] = createModelsFromBaseModel([schema], baseModel)

    expect(model.getAll()).toEqual([
      {
        name: 'Slardar',
        game: 'Dotes',
        game_type: 'MOBA',
        class: 'Slytherin',
        __metadata: { rowIdx: [1], uid: '1' },
      },
      {
        name: 'Slark',
        game: 'Dotes',
        game_type: 'MOBA',
        class: 'Frog',
        __metadata: { rowIdx: [2], uid: '1' },
      },
      {
        name: 'King',
        game: '7DS',
        game_type: 'RPG?',
        class: 'Fairy',
        __metadata: { rowIdx: [3], uid: '1' },
      },
      {
        name: 'Exia',
        game: 'Arknights',
        game_type: 'TD',
        class: 'Angel',
        __metadata: { rowIdx: [4], uid: '1' },
      },
    ])
  })
  it('should be able to change values from a merged schema', () => {
    const baseGrid = [
      ['Slardar', 'Slytherin', 'Dotes', 'MOBA', 'PC', '888'],
      ['Slark', 'Frog', 'Dotes', 'MOBA', 'PC', '1'],
      ['King', 'Fairy', '7DS', 'RPG?', 'Mobile', '99999'],
      ['Exia', 'Angel', 'Arknights', 'TD', 'Mobile', '9'],
    ]
    const baseSchema = createSchema({
      range: 'B:F',
      header: ['name', 'class', 'game', 'game_type', 'platform'],
    })

    const baseModel = createModel(baseSchema, baseGrid)

    const schema1 = createSchema({
      range: 'B:B',
      header: ['name'],
    })
    const schema2 = createSchema({
      range: 'D:E',
      header: ['game', 'game_type'],
    })
    const schema3 = createSchema({
      range: 'C:C',
      header: ['class'],
    })

    const schema = mergeSchema([schema1, schema2, schema3])

    const [model] = createModelsFromBaseModel([schema], baseModel)

    const exia = model.get({ name: 'Exia' })
    model.update(exia, { class: 'Laterano' })
    const changes = model.getChanges()

    expect(changes).toEqual([
      {
        fieldname: 'class',
        value: { from: 'Angel', to: 'Laterano' },
        __metadata: { rowIdx: [4], column: 'C' },
      },
    ])
  })
})
