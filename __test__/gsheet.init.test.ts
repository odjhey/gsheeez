type TGridSchemaInput = {
  range: string
  header: ArrayLike<string>
}

type TSchema = ArrayLike<{
  key: string
  __metadata: { column: string }
}>

const createSchema = (input: TGridSchemaInput): TSchema => {
  const [from, to] = input.range.split(':')
  let token = from
  let chars = []
  if (from.charCodeAt(0) <= to.charCodeAt(0)) {
    while (token <= to) {
      chars.push(token)
      token = String.fromCharCode(token.charCodeAt(0) + 1)
    }
  }

  const schema = chars.map((char, idx) => {
    return {
      key: input.header[idx],
      __metadata: {
        column: char,
      },
    }
  })

  return schema
}

describe('models', () => {
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

  it('should be able to create a model from a schema', () => {

  })
  it('should be able to create a model and a schema from a single grid', () => {

  })
})
