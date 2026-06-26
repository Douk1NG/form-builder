import { useEffect } from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useTranslation } from 'react-i18next'

export function usePlaygroundLayout() {
    const formId = useFormBuilderStore((state) => state.formId)
    const createNewForm = useFormBuilderStore((state) => state.createNewForm)
    const savedForms = useFormBuilderStore((state) => state.savedForms)
    const hasSelectedItem = useFormBuilderStore((state) => state.selectedItemId !== null)
    const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)
    const { t: translations } = useTranslation('translation', { keyPrefix: 'playground' })

    useEffect(() => {
        const hasNoSavedForms = Object.keys(savedForms).length === 0
        if (!formId && hasNoSavedForms) {
            createNewForm(translations('builder.header.untitledForm'))
        }
    }, [formId, savedForms, createNewForm])

    const propertiesSidebarWidth = (() => {
        if (!hasSelectedItem) return 'w-80'
        return isPropertiesExpanded ? 'w-1/2' : 'w-80'
    })()

    return {
        formId,
        propertiesSidebarWidth,
    }
}