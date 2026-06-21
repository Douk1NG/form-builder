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

    useEffect(() => {
        if (!inheritFrom) return

        const sourceValue = getFieldValue?.(inheritFrom.field)
        if (sourceValue === previousValue.current) return

        if (Array.isArray(sourceValue)) {
            const valueToInherit = sourceValue.map(item => {
                if (inheritFrom.property) {
                    return item?.[inheritFrom.property]
                }
                return item
            }).flat()

            previousValue.current = valueToInherit
            onInherit(valueToInherit)
            return
        }

        const valueToInherit = inheritFrom.property
            ? (sourceValue as Record<string, unknown>)?.[inheritFrom.property]
            : sourceValue

        previousValue.current = sourceValue
        onInherit(valueToInherit)

    }, [inheritFrom?.field, getFieldValue, onInherit])
}
