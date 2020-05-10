import { TSchema } from '.'
import { makeToJSONWithSchema } from './utils'

type TGrid = Array<Array<any>>

type TModel<T> = {
  getAll: (options?: { applyUnsavedUpdates: boolean }) => Array<T>
  get: (filter, options?: { applyUnsavedUpdates: boolean }) => T
  getById: (id) => T
  filter: (filter) => Array<T>
  update: (obj: T, fields) => T
  getChanges: () => TChangeRecords
  clearChanges: () => void

  setGrid: (grid: TGrid) => void
  getGrid: (options?: { applyUnsavedUpdates: boolean }) => TGrid
  setGridRefresh: (refresh: () => Promise<TGrid>) => Promise<any>

  //recursive-ish
  groupByKeys: (options?: { keysOnly: boolean }) => any

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

const getIndexOfSchemaFromBaseSchema = (
  schema: TSchema,
  baseSchema: TSchema,
): Array<number> => {
  const retVal = schema.map((col) => {
    const baseSchemaField = baseSchema.find(
      (element) => element.key === col.key,
    )
    if (!baseSchemaField) {
      throw new Error(`${col.key} not found in base schema.`)
    }
    return baseSchemaField.__metadata.idx
  })

  return retVal
}

/*eslint no-use-before-define: off */
const makeCreateModel = (hashFn) => (
  schema: TSchema,
  _grid?: TGrid,
  rowIdxs?: Array<Array<number>>,
): TModel<any> => {
  let changes = []
  let grid: TGrid

  const lGetGrid = (options): TGrid => {
    if (options.applyUnsavedUpdates) {
      const patch = changes.flatMap((change) => {
        return change.__metadata.rowIdx.map((ridx) => ({
          rowIdx: ridx - 1,
          colIdx: getFieldFromSchema(change.fieldname, schema).__metadata.idx,
          newValue: change.value.to,
        }))
      })
      const newGrid = Array.from(grid || [])
      patch.forEach((p) => {
        newGrid[p.rowIdx][p.colIdx] = p.newValue
      })
      return newGrid
    }
    return grid
  }

  const makeToJSON = (phashFn, groupingIdxs) => (pschema, pgrid) => {
    return makeToJSONWithSchema(phashFn)(pschema, pgrid, groupingIdxs)
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const setGrid = (newGrid, oldGrid) => {
    //    if (newGrid) {
    //      if (newGrid.length > schema.length) {
    //        console.warn(
    //          'Grid is longer than defined schema. Some grid data will not be captured.',
    //        )
    //      } else if (newGrid.length < schema.length) {
    //        console.warn(
    //          'Schema is longer than grid. Some fields will be undefined.',
    //        )
    //      }
    //    }
    return newGrid
  }

  grid = setGrid(_grid, grid)

  const model = {
    getAll: (options = { applyUnsavedUpdates: true }) =>
      makeToJSON(hashFn, rowIdxs)(schema, lGetGrid(options)),
    get: (filter, options = { applyUnsavedUpdates: true }) =>
      createGetOne(
        schema,
        lGetGrid(options),
        makeToJSON(hashFn, rowIdxs),
      )(filter),
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
      grid = setGrid(newGrid, grid)
    },
    getGrid: (options = { applyUnsavedUpdates: true }) => lGetGrid(options),
    setGridRefresh: async (refresh) => {
      grid = await refresh()
    },
    getChanges: () => changes,
    clearChanges: () => {
      changes = []
    },

    groupByKeys: (options = { keysOnly: false }) => {
      return makeGroupByKeys(hashFn, model)(options)
    },

    __metadata: {
      schema,
    },
  }

  return model
}

const makeGroupByKeys = (hashFn, baseModel) => (options) => {
  const createFromBaseModel = makeCreateModelsFromBaseModel(hashFn)
  const [newModel] = createFromBaseModel(
    [baseModel.__metadata.schema],
    baseModel,
    options,
  )
  return newModel
}

const getGroupedGrid = (grid, keyGridIdx): Array<any> => {
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
  schemas: Array<TSchema>,
  baseModel: TModel<any>,
  options = { keysOnly: false },
): Array<TModel<any>> => {
  const models = schemas.map((schema) => {
    const baseSchema = baseModel.__metadata.schema

    const schemaXoptions = schema.filter((s) => {
      return options.keysOnly ? s.__metadata.isUniqueIdfier : true
    })

    const idxFromSchema = getIndexOfSchemaFromBaseSchema(
      schemaXoptions,
      baseSchema,
    )

    // get unique entries of grid
    const groupedGrid = getGroupedGrid(baseModel.getGrid(), idxFromSchema)

    //update schema, add baseIndex
    const newSchemaWithBaseIdx = schemaXoptions.map((item, idx) => {
      return {
        ...item,
        __metadata: {
          ...item.__metadata,
          baseIdx: idxFromSchema[idx],
        },
      }
    })

    const groupedGridVals = groupedGrid.map((g) => {
      return g.values
    })

    const gridFilteredByCol = groupedGridVals.map((row) => {
      const newRow = []
      idxFromSchema.forEach((i) => {
        newRow.push(row[i])
      })
      return newRow
    })

    return makeCreateModel(hashFn)(
      newSchemaWithBaseIdx,
      gridFilteredByCol,
      groupedGrid.map((g) => {
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
