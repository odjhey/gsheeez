import { TSchema } from './schema'

type TData<T> = {
  __metadata: {
    rowIdx: Array<number>
    uid: any
  }
}

const makeToJSONWithSchema = ( hashFn ) => (
  schema: TSchema,
  grid: Array<Array<TData<any>>> = [],
) => {
  // convert to json obj, header = idx 0
  const toJson = []
  const header = schema.map((item) => item.key)
  grid.forEach((row, rowIdx) => {
    const lineObj: any = {}

    header.forEach((field, col) => {
      lineObj[header[col]] = row[col]
    })

    lineObj.__metadata = { rowIdx: rowIdx + 1 }
    lineObj.__metadata.uid = hashFn( JSON.stringify(lineObj) )

    toJson.push(lineObj)
  })

  return toJson
}

export { makeToJSONWithSchema }
export { TData }
