const nextChar = (curr) => {
  const currNoCase = curr.toUpperCase(curr)

  const max = 'Z'.charCodeAt(0) //90
  const min = 'A'.charCodeAt(0) //65

  const arr = currNoCase.split('')

  const getNextNum = (
    num,
  ): { curr: number; next: number; overflow: boolean } => {
    if (num < max) {
      return {
        curr: num,
        next: num + 1,
        overflow: false,
      }
    } else {
      return {
        curr: num,
        next: min,
        overflow: true,
      }
    }
  }

  const nextArrObj = arr.map((item) => {
    const charCode = item.charCodeAt(0)
    const nextCharCode = getNextNum(charCode)
    return nextCharCode
  })

  const nextToken = nextArrObj
    .reverse()
    .reduce((accu, item, idx, arr) => {
      if (idx === 0) {
        accu.push(item.next)
      } else {
        if (arr[idx - 1].overflow) {
          //if previous is overflow
          accu.push(item.next)
        } else {
          accu.push(item.curr)
        }
      }

      // last token
      if (idx + 1 === arr.length && item.overflow) {
        accu.push(min)
      }
      return accu
    }, [])
    .reverse()
    .map((item) => String.fromCharCode(item))

  return nextToken.join('')
}

describe('char sequence A-ZZZ', () => {
  it('should be able to get next char after a', () => {
    const given = 'A'
    const next = nextChar(given)

    expect(next).toBe('B')
  })

  it('should be able to ignore case', () => {
    const given = 'a'
    const next = nextChar(given)

    expect(next).toBe('B')
  })

  it('should be able to get next char after z', () => {
    const given = 'z'
    const next = nextChar(given)

    expect(next).toBe('AA')
  })

  it('should be able to get next double chars after BX', () => {
    const given = 'BX'
    const next = nextChar(given)

    expect(next).toBe('BY')
  })

  it('should be able to grow more than 2 chars ', () => {
    const given = 'ZZZ'
    const next = nextChar(given)

    expect(next).toBe('AAAA')
  })

  it('should be able to get next multi', () => {
    const given = 'ADF'
    const next = nextChar(given)

    expect(next).toBe('ADG')
  })

  it('should be able to get next increment middle char', () => {
    const given = 'ADZ'
    const next = nextChar(given)

    expect(next).toBe('AEA')
  })
})
