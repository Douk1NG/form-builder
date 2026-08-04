import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function usePlaygroundLayout() {
    const formId = useFormBuilderStore((state) => state.formId)
    const hasSelectedItem = useFormBuilderStore((state) => state.selectedItemId !== null)
    const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)

    const propertiesSidebarWidth = (() => {
        if (!hasSelectedItem) return 'w-80'
        return isPropertiesExpanded ? 'w-1/2' : 'w-80'
    })()

    return {
        formId,
        propertiesSidebarWidth,
    }
}