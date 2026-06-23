import React from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function useGroupFieldItem(fieldId: string | undefined) {
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const isSelected = selectedItemId === fieldId

  const handleSelect = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation()
    setSelectedItem(fieldId ?? null)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect(event)
    }
  }

  return {
    isSelected,
    handleSelect,
    handleKeyDown
  }
}
