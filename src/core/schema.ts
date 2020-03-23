type TGridSchemaInput = {
  range: string
  header: ArrayLike<string>
}

type TSchema = Array<{
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

const toJSONWithSchema = (schema: TSchema, grid) => {
  //convert to json obj, header = idx 0
  let toJson = []
  let header = schema.map(item => item.key)
  grid.forEach((row, rowIdx) => {
    let lineObj = {}

    header.forEach((field, col) => {
      lineObj[header[col]] = row[col]
    })

    lineObj['__metadata'] = { rowIdx: rowIdx + 1}

    toJson.push(lineObj)
  })

  return toJson
}

export { createSchema }
export { toJSONWithSchema }
export { TSchema }
