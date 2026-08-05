import { describe, it, expect } from 'vitest'
import { resolveLocalizedString } from './locales'

describe('resolveLocalizedString', () => {
  it('returns empty string if value is undefined', () => {
    expect(resolveLocalizedString(undefined)).toBe('')
  })

  it('returns original string if value is a string', () => {
    expect(resolveLocalizedString('Hello')).toBe('Hello')
  })

  it('resolves the value for the given locale if present', () => {
    const localized = { en: 'Hello', es: 'Hola' }
    expect(resolveLocalizedString(localized, 'es')).toBe('Hola')
    expect(resolveLocalizedString(localized, 'en')).toBe('Hello')
  })

  it('falls back to "en" if the requested locale is empty or missing', () => {
    const localized = { en: 'Hello', es: '' }
    expect(resolveLocalizedString(localized, 'es')).toBe('Hello')
  })

  it('falls back to the first non-empty key if both the requested locale and "en" are missing/empty', () => {
    const localized = { en: '', es: '', fr: 'Bonjour' }
    expect(resolveLocalizedString(localized, 'es')).toBe('Bonjour')
  })

  it('returns empty string if all translations are empty', () => {
    const localized = { en: '', es: '   ' }
    expect(resolveLocalizedString(localized, 'es')).toBe('')
  })
})
