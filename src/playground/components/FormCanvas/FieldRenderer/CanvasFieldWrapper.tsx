import { LEFT, RIGHT, TOP, BOTTOM } from '@/playground/constants/edgeConstants'
import { useEdgeDraggable } from '@/playground/hooks/useEdgeDraggable'
import { useCanvasFieldWrapper } from '@/playground/hooks/useCanvasFieldWrapper'
import { FieldActionToolbar } from '@/playground/components/FormCanvas/FieldRenderer/FieldActionToolbar'
import { MobileFieldActionMenu } from '@/playground/components/FormCanvas/FieldRenderer/MobileFieldActionMenu'
import { EdgeIndicators } from '@/playground/components/FormCanvas/EdgeIndicators'
import { DragHandle } from '@/playground/components/FormCanvas/DragHandle'
import { useIsMobile } from '@/playground/hooks/useIsMobile'
import { useMobilePropertiesHud } from '@/playground/hooks/useMobilePropertiesHud'

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
  const isMobile = useIsMobile()
  const { openPropertiesHud } = useMobilePropertiesHud()

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

  const mobileWrapperPadding = isMobile ? 'p-4' : 'p-5 pl-12'

  return (
    <div
      ref={wrapperRef}
      className={`relative group rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-sm ${mobileWrapperPadding} ${borderClass} ${draggingClassName}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      data-canvas-field-wrapper="true"
      onKeyDown={(event) => handleOnKeyDown(event, onSelect)}
    >
      {!isMobile && <DragHandle ref={dragHandleRef} />}

      {isMobile ? (
        <MobileFieldActionMenu
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
          onOpenProperties={() => {
            onSelect()
            openPropertiesHud()
          }}
        />
      ) : (
        <FieldActionToolbar
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemove={onRemove}
        />
      )}

      <div className="pointer-events-none opacity-80">
        {children}
      </div>

      {!isMobile && <EdgeIndicators closestEdge={closestEdge} />}
    </div>
  )
}