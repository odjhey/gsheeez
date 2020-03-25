import { toJSONWithSchema } from '.'
import { TSchema } from './schema'

type TModel<T> = {
  getAll: () => ArrayLike<T>
  get: (filter) => T
}
type TGrid = ArrayLike<ArrayLike<string>>

const createModel = (schema: TSchema, grid: TGrid): TModel<any> => {
  return {
    getAll: () => {
      return toJSONWithSchema(schema, grid)
    },
    get: filter => {
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
    },
  }
}

export { createModel }
export { TGrid, TModel }
