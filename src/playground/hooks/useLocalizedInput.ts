import { useState, useEffect } from 'react'
import type { LocalizedString } from '../../types/form'

const defaultLocale = 'en'

type UseLocalizedInputParameters = {
    value: LocalizedString | undefined
    onChange: (value: LocalizedString) => void
}

function isLocalizedObject(value: LocalizedString | undefined): value is Record<string, string> {
    return typeof value === 'object' && value !== null
}

export function useLocalizedInput({ value, onChange }: UseLocalizedInputParameters) {
    const [isLocalized, setIsLocalized] = useState(isLocalizedObject(value))

    useEffect(() => {
        setIsLocalized(isLocalizedObject(value))
    }, [value])

    const toggleLocalization = () => {
        if (!isLocalized) {
            const isStringValue = typeof value === 'string'
            const currentString = isStringValue ? value : ''
            onChange({ [defaultLocale]: currentString, es: '' })
            setIsLocalized(true)

            return;
        }
        const localizedValue = isLocalizedObject(value) ? value : {}
        const englishValue = localizedValue[defaultLocale]
        const firstAvailableValue = Object.values(localizedValue)[0]
        const fallbackValue = englishValue || firstAvailableValue || ''
        onChange(fallbackValue)
        setIsLocalized(false)
    }

    const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value)
    }

    const handleLocalizedChange = (locale: string, text: string) => {
        const currentObject = isLocalizedObject(value) ? { ...value } : {}
        currentObject[locale] = text
        onChange(currentObject)
    }

    return {
        isLocalized,
        toggleLocalization,
        handleStringChange,
        handleLocalizedChange,
    }
}