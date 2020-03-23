import { splitGrid, getByKey, toJSON } from '../src/helpers'
import { groupByKeys } from '../src/core'

const grid = [
  ['name', 'class', 'hp'],
  ['Slardar', 'Roam', '888'],
  ['Slark', 'Agi', '1'],
  ['King', 'Fairy', '99999'],
]
//const heroSchema = createSchema({
//  range: 'B:D',
//  header: ['Name', 'Class', 'HP'],
//})

describe('Helpers', () => {
  it('should be able break header from non headers', () => {
    const heroHeader = grid[0]
    let heroes = Array.from(grid)
    heroes.shift()
    const [header, body] = splitGrid(grid)
    expect(header).toEqual(heroHeader)
    expect(body).toEqual(heroes)
  })

  it('should get item by key', () => {
    const item = getByKey({ name: 'Slark' }, grid)
    expect(item).toMatchObject({
      name: 'Slark',
      class: 'Agi',
      hp: '1',
    })

    const itemByClass = getByKey({ class: 'Roam' }, grid)
    expect(itemByClass).toMatchObject({
      name: 'Slardar',
      class: 'Roam',
      hp: '888',
    })
  })

  /**
  it('should be able to compose a multilevel object from a complex grid', () => {
    const complexGrid = [
      ['H1', 'ITEM1', 'SIT1', 'A'],
      ['H1', 'ITEM1', 'SIT2', 'B'],
      ['H1', 'ITEM1', 'SIT3', 'C'],
      ['H1', 'ITEM2', 'SIT1', 'D'],
      ['H2', 'ITEM1', 'SIT1', 'E'],
    ]
    const exp = [
      {
        head: ['H1', 'ITEM1', 'SIT1', 'A'],
        items: [
          {
            value: ['H1', 'ITEM1', 'SIT1', 'A'],
            subitems: [
              ['H1', 'ITEM1', 'SIT1', 'A'],
              ['H1', 'ITEM1', 'SIT2', 'B'],
              ['H1', 'ITEM1', 'SIT3', 'C'],
            ],
          },
        ],
      },
    ]

    expect(false).toBe(true)
  }) 
  **/
})
