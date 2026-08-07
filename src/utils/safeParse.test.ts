import { describe, it, expect } from 'vitest'
import { safeParseFloat, safeParseBoolean, safeParseJSON } from './safeParse'

describe('safeParseFloat', () => {
  it('parses valid float strings', () => {
    expect(safeParseFloat('1.23')).toBeCloseTo(1.23)
  })

  it('returns original value if not a string', () => {
    expect(safeParseFloat(123)).toBe(123)
    expect(safeParseFloat(null)).toBeNull()
  })

  it('returns original string when parsing produces NaN', () => {
    expect(safeParseFloat('hello')).toBe('hello')
    expect(safeParseFloat('')).toBe('')
  })
})

describe('safeParseBoolean', () => {
  it('correctly parses "true" and "false" strings', () => {
    expect(safeParseBoolean('true')).toBe(true)
    expect(safeParseBoolean('false')).toBe(false)
  })

  it('handles other string representations of booleans', () => {
    expect(safeParseBoolean('1')).toBe(true)
    expect(safeParseBoolean('0')).toBe(false)
    expect(safeParseBoolean('TRUE')).toBe(true)
    expect(safeParseBoolean('FALSE')).toBe(false)
  })

  it('returns original string for unrecognized boolean strings', () => {
    expect(safeParseBoolean('yes')).toBe('yes')
    expect(safeParseBoolean('no')).toBe('no')
  })

  it('returns original value for non-strings', () => {
    expect(safeParseBoolean(true)).toBe(true)
    expect(safeParseBoolean(false)).toBe(false)
    expect(safeParseBoolean(null)).toBeNull()
  })
})

describe('safeParseJSON', () => {
  it('parses valid JSON string', () => {
    expect(safeParseJSON('{"hello":"world"}')).toEqual({ hello: 'world' })
  })

  it('returns original value if JSON is invalid instead of throwing', () => {
    expect(safeParseJSON('{invalid json}')).toBe('{invalid json}')
  })

  it('returns original value if not a string', () => {
    const objectValue = { foo: 'bar' }
    expect(safeParseJSON(objectValue)).toBe(objectValue)
  })
})
