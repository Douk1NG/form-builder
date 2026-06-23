import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useGroupDropZone(groupId: string) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => ({ groupId }),
      canDrop: ({ source }) => source.data.source === 'palette' || source.data.source === 'canvas',
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    })
  }, [groupId])

  return {
    dropRef,
    isOver
  }
}
