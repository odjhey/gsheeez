import { toJSONWithSchema } from '.'
import { TSchema } from './schema'

type TGrid = Array<Array<any>>

type TModel<T> = {
  getAll: () => Array<T>
  get: (filter) => T
  filter: (filter) => Array<T>
  update: (obj: T, fields) => T
  getChanges: () => TChangeRecords
  clearChanges: () => void

  setGrid: (grid: TGrid) => void
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

const createModel = (schema: TSchema, _grid?: TGrid): TModel<any> => {
  let changes = []
  let grid: TGrid = _grid

  return {
    getAll: () => {
      return toJSONWithSchema(schema, grid)
    },
    get: filter => createGetOne(schema, grid)(filter),
    update: (obj, fields) => {
      const newObj = Object.assign({}, obj)

      Object.keys(fields).forEach(f => {
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

    filter: filterFn => createFilter(schema, grid)(filterFn),
    setGrid: newGrid => {
      grid = newGrid
    },
    setGridRefresh: async refresh => {
      grid = await refresh()
    },
    getChanges: () => {
      return changes
    },
    clearChanges: () => {
      changes = []
    },
    __metadata: {
      schema,
    },
  }
}

const getFieldFromSchema = (fieldname: string, schema: TSchema) => {
  const sch = schema.filter(item => item.key === fieldname)
  return sch[0]
}

const createChangeRecord = (from: any, to: any, info): TChangeRecord => {
  return {
    fieldname: info.fieldname,
    value: { from, to },
    __metadata: {
      rowIdx: info.rowIdx,
      column: info.column,
    },
  }
}

const createFilter = (schema, grid) => filter => {
  const objs = toJSONWithSchema(schema, grid)
  const filtered = objs.filter(filter)
  return filtered
}

const createGetOne = (schema, grid) => filter => {
  const objs = toJSONWithSchema(schema, grid)
  const filtered = objs.filter(obj => {
    let pass = true

    Object.keys(filter).forEach(f => {
      if (obj[f] == filter[f]) {
        //guchi
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

export { createModel }
export { TGrid, TModel }
