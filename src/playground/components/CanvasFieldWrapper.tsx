import { useEffect, useRef, useState } from 'react'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Button } from '../../components/ui/button'
import { ArrowUp, ArrowDown, Trash2, GripVertical } from 'lucide-react'

export type CanvasFieldWrapperProps = {
  id: string
  index: number
  isSelected: boolean
  onSelect: () => void
  onMoveUp: (event: React.MouseEvent) => void
  onMoveDown: (event: React.MouseEvent) => void
  onRemove: (event: React.MouseEvent) => void
  children: React.ReactNode
}

export function CanvasFieldWrapper({
  id,
  index,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  children
}: CanvasFieldWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const el = ref.current
    const handle = dragHandleRef.current
    if (!el || !handle) return

    const cleanupDraggable = draggable({
      element: el,
      dragHandle: handle,
      getInitialData: () => ({ id, index, source: 'canvas' }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDropTarget = dropTargetForElements({
      element: el,
      getData: () => ({ id, index }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    })

    return () => {
      cleanupDraggable()
      cleanupDropTarget()
    }
  }, [id, index])

  const borderClass = isSelected 
    ? 'border-primary ring-4 ring-primary/10 shadow-md bg-card/90' 
    : isDragOver
      ? 'border-primary border-t-4 hover:border-primary/50 shadow-sm bg-card/60'
      : 'border-border/50 hover:border-primary/40 shadow-sm bg-card/50'

  return (
    <div 
      ref={ref}
      className={`relative group p-5 pl-12 rounded-xl border-2 transition-all cursor-pointer backdrop-blur-sm ${borderClass} ${isDragging ? 'opacity-50 scale-[0.98] shadow-none border-dashed' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onSelect()
        }
      }}
    >
      <button
        ref={dragHandleRef}
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card shadow-sm border border-border rounded-md p-1 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onMoveUp}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onMoveDown}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="pointer-events-none opacity-80">
        {children}
      </div>
    </div>
  )
}
