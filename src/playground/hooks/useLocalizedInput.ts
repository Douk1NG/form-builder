import { useState, useEffect, useRef } from 'react'
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
    const [localValue, setLocalValue] = useState<LocalizedString | undefined>(value)
    const [prevValue, setPrevValue] = useState<LocalizedString | undefined>(value)

    if (value !== prevValue) {
        setIsLocalized(isLocalizedObject(value))
        setLocalValue(value)
        setPrevValue(value)
    }

    const onChangeRef = useRef(onChange)
    
    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const triggerChange = (newValue: LocalizedString) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        onChangeRef.current(newValue)
    }

    const triggerChangeDebounced = (newValue: LocalizedString) => {
        setLocalValue(newValue)
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            onChangeRef.current(newValue)
        }, 150)
    }

    const toggleLocalization = () => {
        if (!isLocalized) {
            const isStringValue = typeof localValue === 'string'
            const currentString = isStringValue ? localValue : ''
            const newValue = { [defaultLocale]: currentString, es: '' }
            setLocalValue(newValue)
            triggerChange(newValue)
            setIsLocalized(true)
            return
        }
        const localizedValue = isLocalizedObject(localValue) ? localValue : {}
        const englishValue = localizedValue[defaultLocale]
        const firstAvailableValue = Object.values(localizedValue)[0]
        const fallbackValue = englishValue || firstAvailableValue || ''
        setLocalValue(fallbackValue)
        triggerChange(fallbackValue)
        setIsLocalized(false)
    }

    const handleStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        triggerChangeDebounced(val)
    }

    const handleLocalizedChange = (locale: string, text: string) => {
        const currentObject = isLocalizedObject(localValue) ? { ...localValue } : {}
        currentObject[locale] = text
        triggerChangeDebounced(currentObject)
    }

    const handleBlur = () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
            if (localValue !== undefined) {
                onChangeRef.current(localValue)
            }
        }
    }

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])

    return {
        localValue,
        isLocalized,
        toggleLocalization,
        handleStringChange,
        handleLocalizedChange,
        handleBlur
    }
}