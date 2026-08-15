import type React from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useFieldGroupRenderer } from '@/playground/hooks/useFieldGroupRenderer'
import { useEdgeDraggable } from './useEdgeDraggable'
import { TOP, BOTTOM } from '@/playground/constants/edgeConstants'
import { useTranslation } from 'react-i18next'

type GroupStylesInput = {
  isLocked: boolean
  isSelected: boolean
  isDragOver: boolean
  isDragging: boolean
}

function computeGroupStyles({ isLocked, isSelected, isDragOver, isDragging }: GroupStylesInput) {
  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
  const lockedStyles = 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/5 bg-card/90'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/70 hover:shadow-sm'
  const dragOverStyles = 'border-primary/40 shadow-sm bg-card/80'

  const computedBorderClass =
    [isLocked && lockedStyles, isSelected && selectedStyles, isDragOver && dragOverStyles]
      .find(Boolean) ?? defaultStyles

  const draggingClass = isDragging ? 'opacity-40 scale-[0.98] shadow-none border-dashed' : ''

  const lockedHeaderStyles = 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
  const unlockedHeaderStyles = 'border-border/40 bg-muted/30 hover:bg-muted/50'
  const headerClass = isLocked ? lockedHeaderStyles : unlockedHeaderStyles

  const lockedAccentStyles = { icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', label: 'text-emerald-600 dark:text-emerald-400' }
  const unlockedAccentStyles = { icon: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', label: 'text-violet-600 dark:text-violet-400' }
  const accentStyles = isLocked ? lockedAccentStyles : unlockedAccentStyles

  return {
    computedBorderClass,
    draggingClass,
    headerClass,
    accentStyles
  }
}

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
  const reorderFieldInGroup = useFormBuilderStore((state) => state.reorderFieldInGroup)

  const { t: translations } = useTranslation("translation", {
    keyPrefix: "playground.fields.group"
  })

  const isLocked = lockedGroupId === groupId

  const {
    elementRef,
    dragHandleRef, isDragging, isDragOver, closestEdge } = useEdgeDraggable({
      id: groupId,
      index,
      allowedEdges: [TOP, BOTTOM],
    })

  const {
    computedBorderClass,
    draggingClass,
    headerClass,
    accentStyles
  } = computeGroupStyles({ isLocked, isSelected, isDragOver, isDragging })

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

  const handleReorderFieldInGroup = (fieldId: string, direction: 'up' | 'down') => (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderFieldInGroup(groupId, fieldId, direction)
  }

  const columns = group?.columns || 1
  const emptySlotCount = Math.max(0, columns - (group?.items.length || 0))

  const lockGroupTranslationLabel = isLocked
    ? translations('status.unlock')
    : translations('status.lock')

  const groupColumnsClass = group && Number(group.columns) === 2 ? 'grid-cols-2' : ''

  return {
    group,
    isSelected,
    isLocked,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
    handleReorderFieldInGroup,
    handleKeyDown,
    handleToggleLock,
    handleAddRow,
    elementRef,
    dragHandleRef,
    isDragging,
    closestEdge,
    computedBorderClass,
    emptySlotCount,
    draggingClass,
    headerClass,
    accentStyles,
    lockGroupTranslationLabel,
    groupColumnsClass,
    translations
  }
}