import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobilePropertiesHud } from './useMobilePropertiesHud'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

describe('useMobilePropertiesHud', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        const store = useFormBuilderStore.getState()
        store.setMobilePropertiesHudOpen(false)
        store.setSelectedItem(null)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('starts with the HUD closed', () => {
        const { result } = renderHook(() => useMobilePropertiesHud())
        expect(result.current.isPropertiesHudOpen).toBe(false)
    })

    it('opens the HUD via openPropertiesHud', () => {
        const { result } = renderHook(() => useMobilePropertiesHud())

        act(() => {
            result.current.openPropertiesHud()
        })

        expect(result.current.isPropertiesHudOpen).toBe(true)
    })

    it('closes the HUD via closePropertiesHud', () => {
        const { result } = renderHook(() => useMobilePropertiesHud())

        act(() => {
            result.current.openPropertiesHud()
        })

        expect(result.current.isPropertiesHudOpen).toBe(true)

        act(() => {
            result.current.closePropertiesHud()
        })

        expect(result.current.isPropertiesHudOpen).toBe(false)
    })

    it('does not auto-open the HUD when not on mobile', () => {
        // useIsMobile returns false in jsdom (no matchMedia)
        const store = useFormBuilderStore.getState()

        renderHook(() => useMobilePropertiesHud())

        act(() => {
            store.setSelectedItem('field-123')
        })

        act(() => {
            vi.advanceTimersByTime(500)
        })

        // Should remain closed because isMobile is false in test env
        expect(useFormBuilderStore.getState().isMobilePropertiesHudOpen).toBe(false)
    })
})
