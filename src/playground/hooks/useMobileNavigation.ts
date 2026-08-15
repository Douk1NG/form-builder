import { useState } from 'react'
import { useIsMobile } from './useIsMobile'

export type MobileTab = 'canvas' | 'preview'

export function useMobileNavigation() {
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<MobileTab>('canvas')

  return {
    isMobile,
    activeTab,
    setActiveTab,
  }
}
