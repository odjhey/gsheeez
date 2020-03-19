import { splitGrid } from '../src/helpers'

const grid = [
  ['Name', 'Class', 'HP'],
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
})
