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

