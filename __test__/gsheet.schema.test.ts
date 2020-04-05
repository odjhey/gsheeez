import { createSchema } from '../src/core'

describe('Schema', () => {
  it('should be able to create a basic schema', () => {
    const schema = createSchema({
      range: 'B:D',
      header: ['Field1', 'Field2', 'Field3'],
    })

    expect(schema).toMatchObject([
      {
        key: 'Field1',
        __metadata: { column: 'B' },
      },
      {
        key: 'Field2',
        __metadata: { column: 'C' },
      },
      {
        key: 'Field3',
        __metadata: { column: 'D' },
      },
    ])
  })
})

describe('Schema error guards', () => {
  it('should throw if range mismatch (longer range)', () => {
    const fn = () => {
      createSchema({
        range: 'B:E',
        header: ['Field1', 'Field2', 'Field3'],
      })
    }

    expect(fn).toThrow(
      'Range(4 columns - B:E) covers more than specified. (3 fields)',
    )
  })

  it('should throw if range mismatch (shorter range)', () => {
    const fn = () => {
      createSchema({
        range: 'B:C',
        header: ['Field1', 'Field2', 'Field3'],
      })
    }

    expect(fn).toThrow(
      'Range(2 columns - B:C) covers less than specified. (3 fields)',
    )
  })

  it('should throw if key specified not in header fields', () => {
    const fn = () => {
      createSchema({
        range: 'B:D',
        header: ['Field1', 'Field2', 'Field3'],
        keys: ['f2'],
      })
    }

    expect(fn).toThrow('Key f2 not specified in header.')
  })
})
