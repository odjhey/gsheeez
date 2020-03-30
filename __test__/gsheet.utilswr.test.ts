import { createSchema } from '../src/core'
import { createModel } from '../src/core'

describe('utils - write ', () => {
  it('should be able to get item for delayed grid setup', () => {
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
    const heroModel = createModel(testSchema)
    heroModel.setGrid(heroes)

    const fairy = heroModel.get({ Class: 'Fairy' })
    console.log(fairy)
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

  it('should be able to list modifications', () => {
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

    const changes = heroModel.getChanges()

    expect(changes).toEqual([
      {
        fieldname: 'HP',
        value: { from: '99999', to: '20' },
        __metadata: {
          rowIdx: 3,
          column: 'D',
        },
      },
    ])
  })

  it('should be able clear modification', () => {
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

    const changes = heroModel.getChanges()

    expect(changes).toEqual([
      {
        fieldname: 'HP',
        value: { from: '99999', to: '20' },
        __metadata: {
          rowIdx: 3,
          column: 'D',
        },
      },
    ])

    heroModel.clearChanges()
    expect(heroModel.getChanges()).toEqual([])
  })

  it('should be able to list MULTIPLE modifications', () => {
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
    const newFairy = heroModel.update(fairy, { HP: '20', Class: 'FatWiz' })

    const slards = heroModel.get({ Name: 'Slardar' })
    const newSlards = heroModel.update(slards, { HP: '1' })

    const changes = heroModel.getChanges()

    expect(changes).toEqual([
      {
        fieldname: 'HP',
        value: { from: '99999', to: '20' },
        __metadata: {
          rowIdx: 3,
          column: 'D',
        },
      },
      {
        fieldname: 'Class',
        value: { from: 'Fairy', to: 'FatWiz' },
        __metadata: {
          rowIdx: 3,
          column: 'C',
        },
      },
      {
        fieldname: 'HP',
        value: { from: '888', to: '1' },
        __metadata: {
          rowIdx: 1,
          column: 'D',
        },
      },
    ])
  })
})
