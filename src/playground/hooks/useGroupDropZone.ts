import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { findItemById, isDescendantOrSelf } from '@/playground/utils/findItemById'

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
        const isValidSource = source.data.source === 'palette' || source.data.source === 'canvas'
        if (!isValidSource) return false

        if (source.data.source === 'canvas') {
          const dragItemId = source.data.id as string
          if (isDescendantOrSelf(itemsData, dragItemId, groupId)) {
            return false
          }
        }

        // If the destination group is a 2-column layout, we do not allow dropping other groups/layouts inside it
        if (isLockedGroupTwoColumns) {
          if (source.data.source === 'palette') {
            const type = source.data.type as string
            if (type === 'field_group' || type === 'column_row') {
              return false
            }
          } else if (source.data.source === 'canvas') {
            const dragItemId = source.data.id as string
            const dragItem = findItemById(itemsData, dragItemId)
            if (dragItem?.kind === 'field_group') {
              return false
            }
          }
        }

        return true
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
