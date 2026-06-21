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
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const element = wrapperRef.current
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

  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card'
  const dragOverStyles = 'border-primary/40 border-t-4 shadow-sm bg-card/70'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/80 hover:shadow-sm'

  const borderClass = isSelected
    ? selectedStyles
    : isDragOver
      ? dragOverStyles
      : defaultStyles

  return (
    <div
      ref={wrapperRef}
      className={`relative group p-5 pl-12 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-sm ${borderClass} ${isDragging ? 'opacity-40 scale-[0.98] shadow-none border-dashed' : ''}`}
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
        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <FieldActionToolbar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
      />

      <div className="pointer-events-none opacity-80">
        {children}
      </div>
    </div>
  )
}

type FieldActionToolbarProps = {
  onMoveUp: (event: React.MouseEvent) => void
  onMoveDown: (event: React.MouseEvent) => void
  onRemove: (event: React.MouseEvent) => void
}

function FieldActionToolbar({ onMoveUp, onMoveDown, onRemove }: FieldActionToolbarProps) {
  return (
    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1 z-10">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md hover:bg-muted"
        onClick={onMoveUp}
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md hover:bg-muted"
        onClick={onMoveDown}
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </Button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
