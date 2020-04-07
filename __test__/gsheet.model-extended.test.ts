import { createSchema } from '../src/core'

import {
  makeCreateModel,
  makeCreateModelsFromBaseModel,
} from '../src/core/model'

const dataGrid = [
  ['Slardar', 'Roam', 'Dotes', 'MOBA', 'PC', '888'],
  ['Slark', 'Agi', 'Dotes', 'MOBA', 'PC', '1'],
  ['King', 'Fairy', '7DS', 'RPG?', 'Mobile', '99999'],
  ['Exia', 'Angel', 'Arknights', 'TD', 'Mobile', '9'],
]
const gridSchema = createSchema({
  range: 'J:O',
  header: ['name', 'class', 'game', 'game_type', 'platform', 'hp'],
})

describe('model utilities', () => {
  const hashFnMock = jest.fn((obj) => '1')
  const createModel = makeCreateModel(hashFnMock)
  const createModelsFromBaseModel = makeCreateModelsFromBaseModel(hashFnMock)

  it('should be able to extract a master list from a grid', () => {
    const testSchema = gridSchema
    const gridModel = createModel(testSchema)

    const allHeroes = gridModel.getAll()
    expect(allHeroes).toEqual([])

    gridModel.setGrid(dataGrid)

    const gameSchema = createSchema({
      range: 'L:N',
      header: ['game', 'game_type', 'platform'],
    })

    const [gameModel] = createModelsFromBaseModel([gameSchema], gridModel)

    const allGames = gameModel.getAll()

    expect(allGames).toEqual([
      {
        game: 'Dotes',
        game_type: 'MOBA',
        platform: 'PC',
        __metadata: { rowIdx: [1, 2], uid: '1' },
      },
      {
        game: '7DS',
        game_type: 'RPG?',
        platform: 'Mobile',
        __metadata: { rowIdx: [3], uid: '1' },
      },
      {
        game: 'Arknights',
        game_type: 'TD',
        platform: 'Mobile',
        __metadata: { rowIdx: [4], uid: '1' },
      },
    ])

    expect(gridModel).not.toBeUndefined()
  })
})
