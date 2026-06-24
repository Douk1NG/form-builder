import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types'

type UseEdgeDraggableParameters = {
    id: string
    index: number
    allowedEdges: Edge[]
}

export function useEdgeDraggable({ id, index, allowedEdges }: UseEdgeDraggableParameters) {
    const elementRef = useRef<HTMLDivElement>(null)
    const dragHandleRef = useRef<HTMLButtonElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

    useEffect(() => {
        const element = elementRef.current
        const handle = dragHandleRef.current
        if (!element || !handle) return

        const cleanupDraggable = draggable({
            element,
            dragHandle: handle,
            getInitialData: () => ({ id, index, source: 'canvas' }),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        })

        const cleanupDropTarget = dropTargetForElements({
            element,
            getData: ({ input }) => {
                return attachClosestEdge(
                    { id, index },
                    { element, input, allowedEdges }
                )
            },
            onDragEnter: ({ self }) => {
                setIsDragOver(true)
                setClosestEdge(extractClosestEdge(self.data))
            },
            onDrag: ({ self }) => {
                setClosestEdge(extractClosestEdge(self.data))
            },
            onDragLeave: () => {
                setIsDragOver(false)
                setClosestEdge(null)
            },
            onDrop: () => {
                setIsDragOver(false)
                setClosestEdge(null)
            },
        })

        return () => {
            cleanupDraggable()
            cleanupDropTarget()
        }
    }, [id, index, allowedEdges])

    return {
        elementRef,
        dragHandleRef,
        isDragging,
        isDragOver,
        closestEdge,
    }
}