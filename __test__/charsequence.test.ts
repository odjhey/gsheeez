import charUtils from '../src/core/charUtils'

describe('char sequence A-ZZZ', () => {
  const { nextChar } = charUtils

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

describe('char compare', () => {
  const { compare } = charUtils
  it('should be able to determine A comes before B', () => {
    const res = compare('A', 'B')
    expect(res).toBeLessThan(0)
  })
  it('should be able to determine B comes after A', () => {
    const res = compare('B', 'A')
    expect(res).toBeGreaterThan(0)
  })
  it('should be able to determine equality', () => {
    const isGreater = compare('A', 'A')
    expect(isGreater).toBe(0)
  })

  it('should be able to determine AA comes before BB -- multi', () => {
    const res = compare('AA', 'B')
    expect(res).toBeGreaterThan(0)
  })
  it('should be able to determine BB comes after AA -- multi', () => {
    const res = compare('B', 'AA')
    expect(res).toBeLessThan(0)
  })
  it('should be able to determine equality -- multi', () => {
    const isGreater = compare('AA', 'AA')
    expect(isGreater).toBe(0)
  })

  it('should be able to determine AA comes before BB -- multi > 2', () => {
    const res = compare('ABA', 'ABC')
    expect(res).toBeLessThan(0)
  })
  it('should be able to determine BB comes after AA -- multi > 2', () => {
    const res = compare('ABA', 'AAA')
    expect(res).toBeGreaterThan(0)
  })
  it('should be able to determine equality -- multi > 2', () => {
    const isGreater = compare('ZZZ', 'ZZZ')
    expect(isGreater).toBe(0)
  })
})

describe('range create', () => {
  const { generateFromRange } = charUtils

  it('should be able to generate a simple range', () => {
    const range = generateFromRange('A', 'C')
    expect(range).toEqual(['A', 'B', 'C'])
  })

  it('should be able to generate a simple long range', () => {
    const range = generateFromRange('A', 'G')
    expect(range).toEqual([
      'A', 'B', 'C',
      'D', 'E', 'F',
      'G'
    ])
  })
  it('should be able to generate a simple long range grow - muli letter', () => {
    const range = generateFromRange('Z', 'AD')
    expect(range).toEqual([
      'Z', 'AA', 'AB',
      'AC', 'AD'
    ])
  })
})
