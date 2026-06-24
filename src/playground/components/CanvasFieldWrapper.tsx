import { GripVertical } from 'lucide-react'
import { LEFT, RIGHT } from '@/playground/constants/edgeConstants'
import { useEdgeDraggable } from '@/playground/hooks/useEdgeDraggable'
import { useCanvasFieldWrapper } from '@/playground/hooks/useCanvasFieldWrapper'
import { FieldActionToolbar } from '@/playground/components/FieldActionToolbar'

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
  const {
    elementRef: wrapperRef,
    dragHandleRef,
    isDragging,
    isDragOver,
    closestEdge
  } = useEdgeDraggable({
    id,
    index,
    allowedEdges: [LEFT, RIGHT]
  })

  const {
    isLeftEdge,
    isRightEdge,
    draggingClassName,
    borderClass,
    handleOnKeyDown
  } = useCanvasFieldWrapper({
    closestEdge,
    isSelected,
    isDragOver,
    isDragging
  })

  return (
    <div
      ref={wrapperRef}
      className={`relative group p-5 pl-12 rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-sm ${borderClass} ${draggingClassName}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => handleOnKeyDown(event, onSelect)}
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

      {isLeftEdge && (
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-primary rounded-l-xl z-20" />
      )}
      {isRightEdge && (
        <div className="absolute top-0 bottom-0 right-0 w-2 bg-primary rounded-r-xl z-20" />
      )}
    </div>
  )
}