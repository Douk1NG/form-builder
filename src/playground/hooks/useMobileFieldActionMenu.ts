import { useState, useCallback } from 'react'

export type MobileFieldActionMenuState = {
    isMenuOpen: boolean
    menuPosition: { top: number; right: number }
    toggleMenu: (event: React.MouseEvent) => void
    closeMenu: () => void
}

export function useMobileFieldActionMenu(): MobileFieldActionMenuState {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })

    const toggleMenu = useCallback((event: React.MouseEvent) => {
        event.stopPropagation()
        const button = event.currentTarget as HTMLElement
        const buttonRect = button.getBoundingClientRect()

        setMenuPosition({
            top: buttonRect.bottom + 4,
            right: window.innerWidth - buttonRect.right,
        })

        setIsMenuOpen((previous) => !previous)
    }, [])

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false)
    }, [])

    return { isMenuOpen, menuPosition, toggleMenu, closeMenu }
}
