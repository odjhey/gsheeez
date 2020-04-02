import { TSchema } from '.'
import { makeToJSONWithSchema } from './utils'

type TGrid = Array<Array<any>>

type TModel<T> = {
  getAll: () => Array<T>
  get: (filter) => T
  getById: (id) => T
  filter: (filter) => Array<T>
  update: (obj: T, fields) => T
  getChanges: () => TChangeRecords
  clearChanges: () => void

  setGrid: (grid: TGrid) => void
  getGrid: () => TGrid
  setGridRefresh: (refresh: () => Promise<TGrid>) => Promise<any>

  __metadata: {
    schema: TSchema
  }
}

type TChangeRecord = {
  fieldname: string
  value: { from: any; to: any }
  __metadata: {
    rowIdx: string
    column: string
  }
}

type TChangeRecords = Array<TChangeRecord>

const createGetById = (schema, grid, hashFn) => (id) => {
  const objs = makeToJSONWithSchema(hashFn)(schema, grid)
  const filtered = objs.filter((obj) => {
    return obj.__metadata.uid === id
  })

  if (filtered.length > 0) {
    return filtered[0]
  }
  return null
}

const createGetOne = (schema, grid, hashFn) => (filter) => {
  const objs = makeToJSONWithSchema(hashFn)(schema, grid)
  const filtered = objs.filter((obj) => {
    let pass = true

    Object.keys(filter).forEach((f) => {
      if (obj[f] === filter[f]) {
        // guchi
      } else {
        pass = false
      }
    })

    return pass
  })

  if (filtered.length > 0) {
    return filtered[0]
  }
  return null
}

const getFieldFromSchema = (fieldname: string, schema: TSchema) => {
  const sch = schema.filter((item) => item.key === fieldname)
  return sch[0]
}

const createChangeRecord = (from: any, to: any, info): TChangeRecord => ({
  fieldname: info.fieldname,
  value: { from, to },
  __metadata: {
    rowIdx: info.rowIdx,
    column: info.column,
  },
})

const createFilter = (schema, grid, hashFn) => (filter) => {
  const objs = makeToJSONWithSchema(hashFn)(schema, grid)
  const filtered = objs.filter(filter)
  return filtered
}

const makeCreateModel = (hashFn) => (
  schema: TSchema,
  _grid?: TGrid,
): TModel<any> => {
  let changes = []
  let grid: TGrid = _grid

  return {
    getAll: () => makeToJSONWithSchema(hashFn)(schema, grid),
    get: (filter) => createGetOne(schema, grid, hashFn)(filter),
    getById: (id) => createGetById(schema, grid, hashFn)(id),
    update: (obj, fields) => {
      const newObj = { ...obj }

      Object.keys(fields).forEach((f) => {
        changes.push(
          createChangeRecord(newObj[f], fields[f], {
            fieldname: f,
            rowIdx: newObj.__metadata.rowIdx,
            column: getFieldFromSchema(f, schema).__metadata.column,
          }),
        )

        newObj[f] = fields[f]
      })

      return newObj
    },

    filter: (filterFn) => createFilter(schema, grid, hashFn)(filterFn),
    setGrid: (newGrid) => {
      grid = newGrid
    },
    getGrid: () => grid,
    setGridRefresh: async (refresh) => {
      grid = await refresh()
    },
    getChanges: () => changes,
    clearChanges: () => {
      changes = []
    },
    __metadata: {
      schema,
    },
  }
}

const makeCreateModelsFromBaseModel = (hashFn) => (
  keySchema: Array<TSchema>,
  baseModel: TModel<any>,
): Array<TModel<any>> => {
  const models = keySchema.map((kSchema) => {
    const baseSchema = baseModel.__metadata.schema
    // get unique entries of grid
    const filteredGridByKey = baseModel.getGrid().reduce((newGrid, row) => {
      // check if in array - only compare keys
      const indexOfKeysInSchema = kSchema.map((col) => {
        return baseSchema.find((element) => element.key === col.key).__metadata
          .idx
      })

      // compare indexes of row and accu
      const alreadyInRecord = newGrid.find((newGridRow) => {
        return indexOfKeysInSchema.reduce((isUniq, schemaIdx) => {
          return newGridRow[schemaIdx] === row[schemaIdx] && isUniq
        }, true)
      })

      if (!alreadyInRecord) {
        newGrid.push(row)
      } // else skip

      return newGrid
    }, [])
    return makeCreateModel(hashFn)(kSchema, filteredGridByKey)
  })
  return models
}

export { makeCreateModel, makeCreateModelsFromBaseModel }
