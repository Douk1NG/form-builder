import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Button } from '../../components/ui/button'
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
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[icon] || Icons.HelpCircle

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      className={`group justify-start h-auto px-4 py-3.5 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 shadow-sm rounded-xl gap-3 text-left w-full ${
        isDragging ? 'opacity-50 scale-95 border-primary border-dashed' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors">
        <IconComponent className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-foreground">{label}</span>
      </div>
    </Button>
  )
}

