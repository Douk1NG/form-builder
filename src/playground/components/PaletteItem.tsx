import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Button } from '../../components/ui/button'
import type { FieldType } from '../../types/form'

export type PaletteItemProps = {
  type: FieldType
  label: string
  icon: string
  onClick: () => void
}

export function PaletteItem({ type, label, onClick }: PaletteItemProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ type, label, source: 'palette' }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [type, label])

  return (
    <Button
      ref={ref}
      variant="outline"
      className={`justify-start h-auto px-4 py-3 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm ${isDragging ? 'opacity-50 scale-95 border-primary border-dashed' : ''}`}
      onClick={onClick}
    >
      <span className="font-medium">{label}</span>
    </Button>
  )
}
