function groupByKeys(keys, data) {
  //const distinctKeys = [ ...new Set(keys)]
  const distinctKeys = keys.reduce((collector = [], item) => {
    if (
      collector.filter(citem => {
        if (JSON.stringify(citem) === JSON.stringify(item)) {
          return true
        }
      }).length === 0
    ) {
      collector.push(item)
    }

    return collector
  }, [])

  const complete = distinctKeys.map(itemKey => {
    const c = {
      key: itemKey,
      items: data.filter(fitem => {
        let isPass = true
        Object.keys(itemKey).forEach((key, index) => {
          if (itemKey[key] === fitem[key]) {
            //
          } else {
            isPass = false
          }
        })

        return isPass
      }),
    }
    return c
  })

  return complete
}

const read = { groupByKeys }

export default read
