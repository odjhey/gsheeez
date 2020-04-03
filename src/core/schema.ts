import charUtils from './charUtils'

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
  const { generateFromRange } = charUtils

  //  let token = from
  //  const chars = []
  //  if (from.charCodeAt(0) <= to.charCodeAt(0)) {
  //    while (token <= to) {
  //      chars.push(token)
  //      token = String.fromCharCode(token.charCodeAt(0) + 1)
  //    }
  //  }
  const chars = generateFromRange(from, to)

  if (chars.length !== input.header.length) {
    if (chars.length > input.header.length)
      throw new Error(
        `Range(${chars.length} columns) covers more than specified. (${input.header.length} fields)`,
      )
    throw new Error(
      `Range(${chars.length} columns) covers less than specified. (${input.header.length} fields)`,
    )
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
        //no keys provided, make all fields a key
        if (!input.keys) return true
        return false
      })(),
    },
  }))

  return schema
}

export { createSchema }
export { TSchema }
