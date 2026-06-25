import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

type UsePaletteItemDragParameters = {
    type: string
    label: string
}

export function usePaletteItemDrag({ type, label }: UsePaletteItemDragParameters) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const element = buttonRef.current
        if (!element) return

        return draggable({
            element,
            getInitialData: () => ({ type, label, source: 'palette' }),
            onDragStart: () => setIsDragging(true),
            onDrop: () => setIsDragging(false),
        })
    }, [type, label])

    return {
        buttonRef,
        isDragging,
    }
}