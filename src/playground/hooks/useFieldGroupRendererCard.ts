import type React from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useFieldGroupRenderer } from '@/playground/hooks/useFieldGroupRenderer'
import { useEdgeDraggable } from './useEdgeDraggable'
import { TOP, BOTTOM } from '@/playground/constants/edgeConstants'

const minimumEmptySlots = 1

export function useFieldGroupRendererCard(groupId: string, index: number) {
  const {
    group,
    isSelected,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
  } = useFieldGroupRenderer(groupId)

  const lockedGroupId = useFormBuilderStore((state) => state.lockedGroupId)
  const toggleLockedGroup = useFormBuilderStore((state) => state.toggleLockedGroup)
  const addRowToGroup = useFormBuilderStore((state) => state.addRowToGroup)

  const isLocked = lockedGroupId === groupId

  const {
    elementRef,
    dragHandleRef, isDragging, isDragOver, closestEdge } = useEdgeDraggable({
      id: groupId,
      index,
      allowedEdges: [TOP, BOTTOM],
    })

  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
  const lockedStyles = 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/5 bg-card/90'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/70 hover:shadow-sm'
  const dragOverStyles = 'border-primary/40 shadow-sm bg-card/80'

  const computedBorderClass =
    [isLocked && lockedStyles, isSelected && selectedStyles, isDragOver && dragOverStyles]
      .find(Boolean) ?? defaultStyles

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelectGroup(event)
    }
  }

  const handleToggleLock = (event: React.MouseEvent) => {
    event.stopPropagation()
    toggleLockedGroup(groupId)
  }

  const handleAddRow = (event: React.MouseEvent) => {
    event.stopPropagation()
    addRowToGroup(groupId)
  }

  const emptySlotCount = group?.items.length === 0
    ? (group.columns || minimumEmptySlots)
    : 0

  return {
    group,
    isSelected,
    isLocked,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
    handleKeyDown,
    handleToggleLock,
    handleAddRow,
    elementRef,
    dragHandleRef,
    isDragging,
    closestEdge,
    computedBorderClass,
    emptySlotCount,
  }
}