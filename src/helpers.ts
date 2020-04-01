type TSplitResult = Array<Array<any>>

const splitGrid = (grid: Array<any>, hidx = 0): TSplitResult => {
  const header = grid[hidx]
  const body = Array.from(grid)
  body.shift()
  return [header, body]
}

const toJSON = (rows) => {
  // convert to json obj, header = idx 0
  const toJson = []
  let header = []
  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      header = row
    } else {
      const lineObj: any = {}

      header.forEach((field, col) => {
        lineObj[header[col]] = row[col]
      })

      lineObj.rowIdx = rowIdx

      toJson.push(lineObj)
    }
  })

  return toJson
}

const getByKey = (key, grid) => {
  const givenGrid = grid
  const gridJson = toJSON(givenGrid)

  const fil = gridJson.filter((item) => {
    const pass = Object.keys(key)
      .map((keyField) => {
        return item[keyField] === key[keyField]
      })
      .reduce((accu, bool) => {
        return bool && accu
      }, true)
    return pass
  })

  return fil[0]
}

export { toJSON, splitGrid, getByKey }
