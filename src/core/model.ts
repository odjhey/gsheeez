import { toJSONWithSchema } from '.'
import { TSchema } from './schema'

type TModel<T> = {
  getAll: () => ArrayLike<T>
}
type TGrid = ArrayLike<ArrayLike<string>>

const createModel = (schema: TSchema, grid: TGrid): TModel<any> => {
  return {
    getAll: () => {
      return toJSONWithSchema(schema, grid)
    },
  }
}

export { createModel }
export { TGrid, TModel }
