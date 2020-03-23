type TSplitResult = Array<Array<any>>

const splitGrid = (grid: Array<any>, hidx = 0): TSplitResult => {
  const header = grid[hidx]
  let body = Array.from(grid)
  body.shift()
  return [header, body]
}

const toJSON = rows => {
  //convert to json obj, header = idx 0
  let toJson = []
  let header = []
  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      header = row
    } else {
      let lineObj = {}

      header.forEach((field, col) => {
        lineObj[header[col]] = row[col]
      })

      lineObj['rowIdx'] = rowIdx

      toJson.push(lineObj)
    }
  })

  return toJson
}

const getByKey = (key, grid) => {
  const givenGrid = grid
  const gridJson = toJSON(givenGrid)

  const fil = gridJson.filter(item => {
    for (var keyField in key) {
      if (item[keyField] === key[keyField]) {
        return item
      }
    }
  })

  return fil[0]
}

export { toJSON, splitGrid, getByKey }
