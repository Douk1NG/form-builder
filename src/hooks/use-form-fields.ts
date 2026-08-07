import { useState, useCallback } from 'react'

export function useFormFields(initialValues: Record<string, unknown>) {
    const [fieldValues, setFieldValues] = useState<Record<string, unknown>>(initialValues)

    const handleFieldChange = useCallback((name?: string, value?: unknown) => {
        if (!name) return
        setFieldValues(prev => ({
            ...prev,
            [name]: value
        }))
    }, [])

    const getFieldValue = useCallback((name?: string) => {
        if (!name) return undefined
        return fieldValues?.[name]
    }, [fieldValues])

    return {
        handleFieldChange,
        getFieldValue
    }
}
