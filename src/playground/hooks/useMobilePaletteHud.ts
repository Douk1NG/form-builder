import { useState, useCallback } from 'react'

export function useMobilePaletteHud() {
    const [isHudOpen, setIsHudOpen] = useState(false)

    const openHud = useCallback(() => {
        setIsHudOpen(true)
    }, [])

    const closeHud = useCallback(() => {
        setIsHudOpen(false)
    }, [])

    const toggleHud = useCallback(() => {
        setIsHudOpen((previous) => !previous)
    }, [])

    return {
        isHudOpen,
        openHud,
        closeHud,
        toggleHud,
    }
}
