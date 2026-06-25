import type { LocalizedString } from '../types/form'
export const DEFAULT_LOCALE = 'en' as const
export const SUPPORTED_LOCALES = ['en', 'es'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

/**
 * Resolves a LocalizedString to a simple string.
 * If the value is an object, it attempts to return the value for the given locale.
 * It falls back to 'en' or the first available key if the specific locale is not found.
 */
export const resolveLocalizedString = (
    value: LocalizedString | undefined,
    locale: string = 'en'
): string => {
    if (!value) return ''

    if (typeof value === 'string') {
        return value
    }

    if (value[locale]) {
        return value[locale]
    }

    if (value['en']) {
        return value['en']
    }

    const firstKey = Object.keys(value)[0]
    return firstKey ? value[firstKey] : ''
}
