type TGridSchemaInput = {
  range: string
  header: Array<string>
  keys?: Array<string>
}

type TSchema = Array<{
  key: string
  __metadata: { column: string; idx: number; isUniqueIdfier: boolean }
}>

const createSchema = (input: TGridSchemaInput): TSchema => {
  const [from, to] = input.range.split(':')
  let token = from
  const chars = []
  if (from.charCodeAt(0) <= to.charCodeAt(0)) {
    while (token <= to) {
      chars.push(token)
      token = String.fromCharCode(token.charCodeAt(0) + 1)
    }
  }

  const schema = chars.map((char, idx) => ({
    key: input.header[idx],
    __metadata: {
      column: char,
      idx,
      isUniqueIdfier: (() => {
        if (input.keys && input.keys.find((k) => input.header[idx] === k)) {
          return true
        }
        return false
      })(),
    },
  }))

  return schema
}

export { createSchema }
export { TSchema }
