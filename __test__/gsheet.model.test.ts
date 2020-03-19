import { createSchema } from '../src/core'

type TModel<T> = {
  getAll: () => ArrayLike<T>
}

describe('Models', () => {
  it('should be able to create a model from a schema', () => {
    const schema = createSchema({
      range: 'B:D',
      header: ['Field1', 'Field2', 'Field3'],
    })

    expect(true).toBe(false)
  })

  it('should be able to create a model and a schema from a single grid', () => {
    expect(true).toBe(false)
  })
})
