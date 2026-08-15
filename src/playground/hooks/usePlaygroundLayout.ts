import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function usePlaygroundLayout() {
    const formId = useFormBuilderStore((state) => state.formId)
    const hasSelectedItem = useFormBuilderStore((state) => state.selectedItemId !== null)
    const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)
    const isPaletteCollapsed = useFormBuilderStore((state) => state.isPaletteCollapsed)
    const isPropertiesCollapsed = useFormBuilderStore((state) => state.isPropertiesCollapsed)
    const setPaletteCollapsed = useFormBuilderStore((state) => state.setPaletteCollapsed)
    const setPropertiesCollapsed = useFormBuilderStore((state) => state.setPropertiesCollapsed)
    const previewMode = useFormBuilderStore((state) => state.previewMode)

    const propertiesSidebarWidth = (() => {
        if (isPropertiesCollapsed) return 'w-0 p-0 overflow-hidden border-none opacity-0'
        if (!hasSelectedItem) return 'w-80'
        return isPropertiesExpanded ? 'w-1/2' : 'w-80'
    })()

    const paletteSidebarWidth = isPaletteCollapsed
        ? 'w-0 p-0 overflow-hidden border-none opacity-0'
        : 'w-64'

    const handleTogglePalette = () => {
        setPaletteCollapsed(!isPaletteCollapsed)
    }

    const handleToggleProperties = () => {
        setPropertiesCollapsed(!isPropertiesCollapsed)
    }

    return {
        formId,
        previewMode,
        isPaletteCollapsed,
        isPropertiesCollapsed,
        paletteSidebarWidth,
        propertiesSidebarWidth,
        handleTogglePalette,
        handleToggleProperties,
        hasSelectedItem,
    }
}