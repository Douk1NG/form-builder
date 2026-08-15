import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT_QUERY = '(max-width: 767px)'

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return undefined
        }

        const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY)

        const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(event.matches)
        }

        handleViewportChange(mediaQuery)
        mediaQuery.addEventListener('change', handleViewportChange)
        return () => {
            mediaQuery.removeEventListener('change', handleViewportChange)
        }
    }, [])

    return isMobile
}
