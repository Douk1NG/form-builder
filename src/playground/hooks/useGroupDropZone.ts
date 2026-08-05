import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { findItemById, isDescendantOrSelf } from '@/playground/utils/findItemById'
import { isCanvasDragData, isPaletteDragData } from '@/playground/types/dragDropTypes'

export function useGroupDropZone(groupId: string) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)
  const itemsData = useFormBuilderStore((state) => state.itemsData)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    const group = findItemById(itemsData, groupId)
    const isLockedGroupTwoColumns = group && group.kind === 'field_group' && (group.columns || 0) > 1

    return dropTargetForElements({
      element,
      getData: () => ({ groupId }),
      canDrop: ({ source }) => {
        if (isCanvasDragData(source.data)) {
          const dragItemId = source.data.id
          if (isDescendantOrSelf(itemsData, dragItemId, groupId)) {
            return false
          }

          if (isLockedGroupTwoColumns) {
            const dragItem = findItemById(itemsData, dragItemId)
            if (dragItem?.kind === 'field_group') {
              return false
            }
          }
          return true
        }

        if (isPaletteDragData(source.data)) {
          if (isLockedGroupTwoColumns) {
            const type = source.data.type
            if (type === 'field_group' || type === 'column_row') {
              return false
            }
          }
          return true
        }

        return false
      },
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    })
  }, [groupId, itemsData])

  return {
    dropRef,
    isOver
  }
}
