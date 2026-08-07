import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { findItemById, isDescendantOrSelf } from '@/playground/utils/findItemById'
import { isCanvasDragData, isPaletteDragData } from '@/playground/types/dragDropTypes'
import { ITEM_KINDS } from '@/types/itemKinds'

export function useGroupDropZone(groupId: string) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)
  const itemsData = useFormBuilderStore((state) => state.itemsData)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return undefined

    const group = findItemById(itemsData, groupId)
    const isLockedGroupTwoColumns = group && group.kind === ITEM_KINDS.FIELD_GROUP && (group.columns || 0) > 1

    return dropTargetForElements({
      element,
      getData: () => ({ groupId }),
      canDrop: ({ source }) => {
        if (isCanvasDragData(source.data)) {
          const dragItemId = source.data.id
          if (isDescendantOrSelf(itemsData, dragItemId, groupId)) return false
          if (!isLockedGroupTwoColumns) return true
          return findItemById(itemsData, dragItemId)?.kind !== ITEM_KINDS.FIELD_GROUP
        }

        if (isPaletteDragData(source.data)) {
          if (!isLockedGroupTwoColumns) return true
          return source.data.type !== ITEM_KINDS.FIELD_GROUP && source.data.type !== ITEM_KINDS.COLUMN_ROW
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
