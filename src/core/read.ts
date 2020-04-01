function groupByKeys(keys, data) {
  // const distinctKeys = [ ...new Set(keys)]
  const distinctKeys = keys.reduce((collector = [], item) => {
    if (
      collector.filter((citem) => {
        return JSON.stringify(citem) === JSON.stringify(item)
      }).length === 0
    ) {
      collector.push(item)
    }
    return collector
  }, [])

  const complete = distinctKeys.map((itemKey) => {
    return {
      key: itemKey,
      items: data.filter((fitem) => {
        let isPass = true
        Object.keys(itemKey).forEach((key) => {
          if (itemKey[key] === fitem[key]) {
            //
          } else {
            isPass = false
          }
        })

        return isPass
      }),
    }
  })

  return complete
}

const read = { groupByKeys }

export default read
