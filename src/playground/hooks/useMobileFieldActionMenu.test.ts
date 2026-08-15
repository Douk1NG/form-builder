import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobileFieldActionMenu } from './useMobileFieldActionMenu'

// Type-safe event mock helper to avoid 'as any' and 'as unknown as T'
function createMockMouseEvent(button: HTMLButtonElement): React.MouseEvent {
    const mock = {
        stopPropagation: vi.fn(),
        currentTarget: button,
        preventDefault: vi.fn(),
        nativeEvent: new MouseEvent('click'),
    }
    // eslint-disable-next-line no-restricted-syntax
    return mock as unknown as React.MouseEvent
}

describe('useMobileFieldActionMenu', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('starts with the menu closed', () => {
        const { result } = renderHook(() => useMobileFieldActionMenu())
        expect(result.current.isMenuOpen).toBe(false)
    })

    it('opens the menu on toggleMenu and calculates position from button rect', () => {
        const { result } = renderHook(() => useMobileFieldActionMenu())

        const mockButton = document.createElement('button')
        vi.spyOn(mockButton, 'getBoundingClientRect').mockReturnValue({
            top: 100,
            bottom: 130,
            left: 200,
            right: 240,
            width: 40,
            height: 30,
            x: 200,
            y: 100,
            toJSON: () => ({}),
        })

        const mockEvent = createMockMouseEvent(mockButton)

        Object.defineProperty(window, 'innerWidth', { value: 400, writable: true })

        act(() => {
            result.current.toggleMenu(mockEvent)
        })

        expect(result.current.isMenuOpen).toBe(true)
        expect(mockEvent.stopPropagation).toHaveBeenCalled()
        expect(result.current.menuPosition.top).toBe(134)
        expect(result.current.menuPosition.right).toBe(160)
    })

    it('closes the menu on closeMenu', () => {
        const { result } = renderHook(() => useMobileFieldActionMenu())

        const mockButton = document.createElement('button')
        vi.spyOn(mockButton, 'getBoundingClientRect').mockReturnValue({
            top: 100, bottom: 130, left: 200, right: 240,
            width: 40, height: 30, x: 200, y: 100, toJSON: () => ({}),
        })

        const mockEvent = createMockMouseEvent(mockButton)

        act(() => {
            result.current.toggleMenu(mockEvent)
        })

        expect(result.current.isMenuOpen).toBe(true)

        act(() => {
            result.current.closeMenu()
        })

        expect(result.current.isMenuOpen).toBe(false)
    })

    it('toggles the menu closed when already open', () => {
        const { result } = renderHook(() => useMobileFieldActionMenu())

        const mockButton = document.createElement('button')
        vi.spyOn(mockButton, 'getBoundingClientRect').mockReturnValue({
            top: 100, bottom: 130, left: 200, right: 240,
            width: 40, height: 30, x: 200, y: 100, toJSON: () => ({}),
        })

        const mockEvent = createMockMouseEvent(mockButton)

        act(() => {
            result.current.toggleMenu(mockEvent)
        })

        expect(result.current.isMenuOpen).toBe(true)

        act(() => {
            result.current.toggleMenu(mockEvent)
        })

        expect(result.current.isMenuOpen).toBe(false)
    })
})
