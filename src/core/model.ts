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

const createGetById = (schema, grid, toJSON) => (id) => {
  const objs = toJSON(schema, grid)
  const filtered = objs.filter((obj) => {
    return obj.__metadata.uid === id
  })

  if (filtered.length > 0) {
    return filtered[0]
  }
  return null
}

const createGetOne = (schema, grid, toJSON) => (filter) => {
  const objs = toJSON(schema, grid)
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

const createFilter = (schema, grid, toJSON) => (filter) => {
  const objs = toJSON(schema, grid)
  const filtered = objs.filter(filter)
  return filtered
}

const makeCreateModel = (hashFn) => (
  schema: TSchema,
  _grid?: TGrid,
  rowIdxs?: Array<Array<number>>,
): TModel<any> => {
  let changes = []
  let grid: TGrid = _grid

  const makeToJSON = (phashFn, prowIdxs) => (pschema, pgrid) => {
    return makeToJSONWithSchema(phashFn)(pschema, pgrid, prowIdxs)
  }

  return {
    getAll: () => makeToJSON(hashFn, rowIdxs)(schema, grid),
    get: (filter) =>
      createGetOne(schema, grid, makeToJSON(hashFn, rowIdxs))(filter),
    getById: (id) =>
      createGetById(schema, grid, makeToJSON(hashFn, rowIdxs))(id),
    update: (obj, fields) => {
      const newObj = { ...obj }

      Object.keys(fields).forEach((f) => {
        newObj.__metadata.rowIdx.forEach((rid) => {
          changes.push(
            createChangeRecord(newObj[f], fields[f], {
              fieldname: f,
              rowIdx: [rid],
              column: getFieldFromSchema(f, schema).__metadata.column,
            }),
          )
        })

        newObj[f] = fields[f]
      })

      return newObj
    },

    filter: (filterFn) =>
      createFilter(schema, grid, makeToJSON(hashFn, rowIdxs))(filterFn),
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
    const filteredGridByKey = baseModel
      .getGrid()
      .reduce((newGrid, row, reduceIdx) => {
        // check if in array - only compare keys
        const indexOfKeysInSchema = kSchema.map((col) => {
          const baseSchemaField = baseSchema.find(
            (element) => element.key === col.key,
          )
          if (!baseSchemaField) {
            throw new Error(`${col.key} not found in base schema.`)
          }
          return baseSchemaField.__metadata.idx
        })

        // compare indexes of row and accu
        const alreadyInRecord = newGrid.find((newGridRow) => {
          //          return newGridRow.values.find((newGridRowVal) => {
          //            return indexOfKeysInSchema.reduce((isUniq, schemaIdx) => {
          //              return newGridRowVal[schemaIdx] === row[schemaIdx] && isUniq
          //            }, true)
          //          })
          return indexOfKeysInSchema.reduce((isUniq, schemaIdx) => {
            return newGridRow.values[schemaIdx] === row[schemaIdx] && isUniq
          }, true)
        })

        if (!alreadyInRecord) {
          newGrid.push({
            values: row,
            idxs: [reduceIdx],
          })
        } else {
          alreadyInRecord.idxs.push(reduceIdx)
        }

        return newGrid
      }, [])

    return makeCreateModel(hashFn)(
      kSchema,
      filteredGridByKey.map((g) => {
        return g.values
      }),
      filteredGridByKey.map((g) => {
        return g.idxs
      }),
    )
  })
  return models
}

export { makeCreateModel, makeCreateModelsFromBaseModel }
