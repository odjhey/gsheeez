type TSplitResult = Array<Array<any>>

const splitGrid = (grid: Array<any>, hidx = 0): TSplitResult => {
  const header = grid[hidx]
  let body = Array.from(grid)
  body.shift()
  return [header, body]
}

export { splitGrid }
