import React from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function useGroupFieldItem(groupId: string, fieldId: string | undefined) {
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const removeFieldFromGroup = useFormBuilderStore((state) => state.removeFieldFromGroup)
  const reorderFieldInGroup = useFormBuilderStore((state) => state.reorderFieldInGroup)

  const isSelected = selectedItemId === fieldId

  const handleSelect = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.stopPropagation()
    setSelectedItem(fieldId ?? null)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelect(event)
    }
  }

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (fieldId) {
      removeFieldFromGroup(groupId, fieldId)
    }
  }

  const handleMoveUp = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (fieldId) {
      reorderFieldInGroup(groupId, fieldId, 'up')
    }
  }

  const handleMoveDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (fieldId) {
      reorderFieldInGroup(groupId, fieldId, 'down')
    }
  }

  return {
    isSelected,
    handleSelect,
    handleKeyDown,
    handleRemove,
    handleMoveUp,
    handleMoveDown,
  }
}

