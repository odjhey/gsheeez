const charUtils = (() => {
  const nextChar = (curr) => {
    const currNoCase = curr.toUpperCase(curr)

    const max = 'Z'.charCodeAt(0) //90
    const min = 'A'.charCodeAt(0) //65

    const arr = currNoCase.split('')

    const getNextNum = (
      num,
    ): { curr: number; next: number; overflow: boolean } => {
      return num < max
        ? {
            curr: num,
            next: num + 1,
            overflow: false,
          }
        : {
            curr: num,
            next: min,
            overflow: true,
          }
    }

    const nextArrObj = arr.map((item) => {
      const charCode = item.charCodeAt(0)
      const nextCharCode = getNextNum(charCode)
      return nextCharCode
    })

    const nextToken = nextArrObj
      .reverse()
      .reduce((accu, item, idx, myarr) => {
        if (idx === 0) {
          accu.push(item.next)
        } else if (myarr[idx - 1].overflow) {
          //if previous is overflow
          accu.push(item.next)
        } else {
          accu.push(item.curr)
        }

        // last token
        if (idx + 1 === myarr.length && item.overflow) {
          accu.push(min)
        }
        return accu
      }, [])
      .reverse()
      .map((item) => String.fromCharCode(item))

    return nextToken.join('')
  }

  const compare = (a, b) => {
    /**
     * Negative when the referenceStr occurs before compareStr
     * Positive when the referenceStr occurs after compareStr
     * Returns 0 if they are equivalent
     * DO NOT rely on exact return values of -1 or 1.
     * NOTE: Negative and positive integer results vary between browsers
     * (as well as between browser versions) because
     * the W3C specification only mandates negative and positive values.
     * Some browsers may return -2 or 2 or even some
     * other negative or positive value.
     */

    return a.length - b.length || a.localeCompare(b, 'en')
  }

  const generateFromRange = (from: string, to: string): Array<string> => {
    const range = []
    let token = from
    while (compare(token, to) <= 0) {
      range.push(token)
      token = nextChar(token)
    }
    return range
  }

  return { nextChar, compare, generateFromRange }
})()

export default charUtils
