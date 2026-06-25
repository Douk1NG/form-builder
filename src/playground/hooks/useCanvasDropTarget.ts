import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export function useCanvasDropTarget() {
    const dropTargetRef = useRef<HTMLDivElement>(null)
    const [isDragOver, setIsDragOver] = useState(false)

    useEffect(() => {
        const element = dropTargetRef.current
        if (!element) return

        return dropTargetForElements({
            element,
            getData: () => ({ isCanvas: true }),
            onDragEnter: () => setIsDragOver(true),
            onDragLeave: () => setIsDragOver(false),
            onDrop: () => setIsDragOver(false),
        })
    }, [])

    return {
        dropTargetRef,
        isDragOver,
    }
}