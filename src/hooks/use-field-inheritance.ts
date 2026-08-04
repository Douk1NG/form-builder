import { useEffect, useRef } from 'react'
import { useInheritanceContext } from '../context/InheritanceProvider'

type InheritanceConfig = {
    field: string
    property?: string
}

export const useFieldInheritance = (
    inheritFrom: InheritanceConfig | undefined,
    onInherit: (value: unknown) => void
) => {
    const { getFieldValue } = useInheritanceContext()
    const previousValue = useRef<unknown>(null)

    const { field, property } = inheritFrom || {}

    useEffect(() => {
        if (!field) return

        const sourceValue = getFieldValue?.(field)
        if (sourceValue === previousValue.current) return

        if (Array.isArray(sourceValue)) {
            const valueToInherit = sourceValue.map(item => {
                if (property) {
                    return item?.[property]
                }
                return item
            }).flat()

            previousValue.current = valueToInherit
            onInherit(valueToInherit)
            return
        }

        const valueToInherit = property
            ? (sourceValue as Record<string, unknown>)?.[property]
            : sourceValue

        previousValue.current = sourceValue
        onInherit(valueToInherit)

    }, [field, property, getFieldValue, onInherit])
}
