import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function useMobilePropertiesHud() {
    const isOpen = useFormBuilderStore((state) => state.isMobilePropertiesHudOpen)
    const setOpen = useFormBuilderStore((state) => state.setMobilePropertiesHudOpen)

    const openPropertiesHud = () => {
        setOpen(true)
    }

    const closePropertiesHud = () => {
        setOpen(false)
    }

    return {
        isPropertiesHudOpen: isOpen,
        openPropertiesHud,
        closePropertiesHud,
    }
}
