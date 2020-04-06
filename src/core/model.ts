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

  //recursive-ish
  groupByKeys: () => any

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

const getIndexFromSchema = (
  schema: TSchema,
  baseSchema: TSchema,
): Array<number> => {
  return schema.map((col) => {
    const baseSchemaField = baseSchema.find(
      (element) => element.key === col.key,
    )
    if (!baseSchemaField) {
      throw new Error(`${col.key} not found in base schema.`)
    }
    return baseSchemaField.__metadata.idx
  })
}

/*eslint no-use-before-define: off */
const makeCreateModel = (hashFn) => (
  schema: TSchema,
  _grid?: TGrid,
  rowIdxs?: Array<Array<number>>,
): TModel<any> => {
  let changes = []
  let grid: TGrid = _grid

  const makeToJSON = (phashFn, groupingIdxs) => (pschema, pgrid) => {
    return makeToJSONWithSchema(phashFn)(pschema, pgrid, groupingIdxs)
  }

  //  const getRowIdxs = (): Array<Array<number>> => {
  //    let idxs = []
  //    if (rowIdxs && rowIdxs.length > 0) {
  //      idxs = rowIdxs
  //    } else {
  //      idxs = getIndexFromSchema(schema, schema)
  //    }
  //
  //    const filteredGridByKey = groupByKey(grid, idxs)
  //    const retVal = filteredGridByKey.map((g) => {
  //      return g.idxs
  //    })
  //    console.log('retVal', retVal)
  //    return retVal
  //  }

  const model = {
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

    groupByKeys: () => {
      return makeGroupByKeys(hashFn, model)()
    },

    __metadata: {
      schema,
    },
  }

  return model
}

const makeGroupByKeys = (hashFn, baseModel) => () => {
  const createFromBaseModel = makeCreateModelsFromBaseModel(hashFn)
  const [newModel] = createFromBaseModel(
    [baseModel.__metadata.schema],
    baseModel,
  )
  return newModel
}

const groupByKey = (grid, keyGridIdx): Array<any> => {
  return grid.reduce((newGrid, row, reduceIdx) => {
    // compare indexes of row and accu
    const alreadyInRecord = newGrid.find((newGridRow) => {
      return keyGridIdx.reduce((isUniq, schemaIdx) => {
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
}

/*eslint no-use-before-define: off */
const makeCreateModelsFromBaseModel = (hashFn) => (
  keySchema: Array<TSchema>,
  baseModel: TModel<any>,
): Array<TModel<any>> => {
  const models = keySchema.map((kSchema) => {
    const baseSchema = baseModel.__metadata.schema
    // get unique entries of grid
    const filteredGridByKey = groupByKey(
      baseModel.getGrid(),
      getIndexFromSchema(kSchema, baseSchema),
    )

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

//const getAllGroupedByKeys = () => (baseModel) => {
//  const [model] = createModelsFromBaseModel(
//    baseModel.__metadata.schema,
//    baseModel,
//  )
//
//  return model.getAll()
//}

export { makeCreateModel, makeCreateModelsFromBaseModel }
