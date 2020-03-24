import { splitGrid, getByKey, toJSON } from '../src/helpers'
import { groupByKeys } from '../src/core'

const grid = [
  ['name', 'class', 'hp'],
  ['Slardar', 'Roam', '888'],
  ['Slark', 'Agi', '1'],
  ['King', 'Fairy', '99999'],
]
const groupDeep = (keys, grid) => {
  /**
   * insert implementation code here
   **/
  return []
}

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

  it('should be able group by header and item', () => {
    const complexGrid = [
      ['hero', 'item', 'stat', 'val'],
      ['Shaker', 'Null Talisman', 'INT', '+6'],
      ['Shaker', 'Null Talisman', 'STR', '+3'],
      ['Shaker', 'Null Talisman', 'AGI', '+3'],
      ['Shaker', 'Dagger', 'Blink', 'zing'],
      ['Mortred', 'Divine', 'Damage', '+9999'],
    ]

    const gridJson = toJSON(complexGrid)
    const grouped = groupByKeys(
      gridJson.map(item => {
        return {
          hero: item['hero'],
        }
      }),
      gridJson,
    )

    const actual = grouped.map(hero => {
      return {
        head: {
          value: hero.key.hero,
        },
        items: [...new Set(hero.items.map(item => item.item))].map(item => ({
          value: item,
        })),
      }
    })

    const exp = [
      {
        head: { value: 'Shaker' },
        items: [
          {
            value: 'Null Talisman',
          },
          {
            value: 'Dagger',
          },
        ],
      },
      {
        head: { value: 'Mortred' },
        items: [
          {
            value: 'Divine',
          },
        ],
      },
    ]

    expect(actual).toStrictEqual(exp)
  })

  it('should be able to compose a 3 level object from a complex grid', () => {
    const complexGrid = [
      ['hero', 'item', 'stat', 'val'],
      ['Shaker', 'Null Talisman', 'INT', '+6'],
      ['Shaker', 'Null Talisman', 'STR', '+3'],
      ['Shaker', 'Null Talisman', 'AGI', '+3'],
      ['Shaker', 'Dagger', 'Blink', 'zing'],
      ['Mortred', 'Divine', 'Damage', '+9999'],
    ]

    const exp = [
      {
        head: { value: ['Shaker', 'Null Talisman', 'INT', '+6'] },
        items: [
          {
            value: ['Shaker', 'Null Talisman', 'INT', '+6'],
            subitems: [
              { value: ['Shaker', 'Null Talisman', 'INT', '+6'] },
              { value: ['Shaker', 'Null Talisman', 'STR', '+3'] },
              { value: ['Shaker', 'Null Talisman', 'AGI', '+3'] },
            ],
          },
          {
            value: ['Shaker', 'Dagger', 'Blink', 'zing'],
            subitems: [{ value: ['Shaker', 'Dagger', 'Blink', 'zing'] }],
          },
        ],
      },
      {
        head: { value: ['Mortred', 'Divine', 'Damage', '+9999'] },
        items: [
          {
            value: ['Mortred', 'Divine', 'Damage', '+9999'],
            subitems: [{ value: ['Mortred', 'Divine', 'Damage', '+9999'] }],
          },
        ],
      },
    ]

    const actual = groupDeep(
      {
        head: { key: 'hero' },
        items: { key: 'item' },
        subitems: { key: 'stat' },
      },
      complexGrid,
    )

    expect(actual).toEqual(exp)
  })
})
