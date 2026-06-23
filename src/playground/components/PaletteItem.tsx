import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import type { FieldType } from '../../types/form'
import * as Icons from 'lucide-react'

export type PaletteItemProps = {
  type: FieldType
  label: string
  icon: string
  onClick: () => void
}

export function PaletteItem({ type, label, icon, onClick }: PaletteItemProps) {
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

  // Dynamically resolve the icon component from Lucide
  const IconComponent = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[icon] || Icons.HelpCircle

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`group flex flex-col items-center justify-center p-3 h-22 rounded-2xl border border-transparent hover:border-primary/20 bg-muted/20 hover:bg-primary/5 hover:shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing w-full gap-2.5 ${isDragging ? 'opacity-50 scale-95 border-primary/40 border-dashed bg-primary/10' : ''
        }`}
      onClick={onClick}
    >
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="font-semibold text-xs text-foreground/80 group-hover:text-foreground text-center leading-tight">{label}</span>
    </button>
  )
}

