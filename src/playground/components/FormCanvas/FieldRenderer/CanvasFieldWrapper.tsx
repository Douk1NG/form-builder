import { LEFT, RIGHT, TOP, BOTTOM } from '@/playground/constants/edgeConstants'
import { useEdgeDraggable } from '@/playground/hooks/useEdgeDraggable'
import { useCanvasFieldWrapper } from '@/playground/hooks/useCanvasFieldWrapper'
import { FieldActionToolbar } from '@/playground/components/FormCanvas/FieldRenderer/FieldActionToolbar'
import { EdgeIndicators } from '@/playground/components/FormCanvas/EdgeIndicators'
import { DragHandle } from '@/playground/components/FormCanvas/DragHandle'

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
    allowedEdges: [LEFT, RIGHT, TOP, BOTTOM]
  })

  const {
    draggingClassName,
    borderClass,
    handleOnKeyDown
  } = useCanvasFieldWrapper({
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
      data-canvas-field-wrapper="true"
      onKeyDown={(event) => handleOnKeyDown(event, onSelect)}
    >
      <DragHandle ref={dragHandleRef} />

      <FieldActionToolbar
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
      />

      <div className="pointer-events-none opacity-80">
        {children}
      </div>

      <EdgeIndicators closestEdge={closestEdge} />
    </div>
  )
}