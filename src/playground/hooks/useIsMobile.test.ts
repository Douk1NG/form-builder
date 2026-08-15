import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './useIsMobile'

describe('useIsMobile', () => {
    const originalMatchMedia = window.matchMedia

    afterEach(() => {
        window.matchMedia = originalMatchMedia
    })

    it('returns false when matchMedia is not available', () => {
        // jsdom doesn't have matchMedia by default — delete it to be sure
        delete (window as Record<string, unknown>).matchMedia
        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)
    })

    it('returns the initial matchMedia result when available', () => {
        const mockAddEventListener = vi.fn()
        const mockRemoveEventListener = vi.fn()

        window.matchMedia = vi.fn().mockReturnValue({
            matches: true,
            addEventListener: mockAddEventListener,
            removeEventListener: mockRemoveEventListener,
        })

        const { result } = renderHook(() => useIsMobile())

        expect(result.current).toBe(true)
        expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('responds to matchMedia change events', () => {
        let changeHandler: ((event: Partial<MediaQueryListEvent>) => void) | null = null

        window.matchMedia = vi.fn().mockReturnValue({
            matches: false,
            addEventListener: vi.fn((_eventName: string, handler: (event: Partial<MediaQueryListEvent>) => void) => {
                changeHandler = handler
            }),
            removeEventListener: vi.fn(),
        })

        const { result } = renderHook(() => useIsMobile())
        expect(result.current).toBe(false)

        act(() => {
            changeHandler?.({ matches: true } as Partial<MediaQueryListEvent>)
        })

        expect(result.current).toBe(true)
    })

    it('cleans up the event listener on unmount', () => {
        const mockRemoveEventListener = vi.fn()

        window.matchMedia = vi.fn().mockReturnValue({
            matches: false,
            addEventListener: vi.fn(),
            removeEventListener: mockRemoveEventListener,
        })

        const { unmount } = renderHook(() => useIsMobile())
        unmount()

        expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })
})
