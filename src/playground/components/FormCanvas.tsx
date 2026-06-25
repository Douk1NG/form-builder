import { useFormCanvas } from '../hooks/useFormCanvas'
import { useCanvasDropTarget } from '../hooks/useCanvasDropTarget'
import { InheritanceProvider } from '../../context/InheritanceProvider'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { PreviewFormRenderer } from './PreviewFormRenderer'
import { CanvasItemRenderer } from './CanvasItemRenderer'
import { EmptyCanvasPlaceholder } from './EmptyCanvasPlaceholder'
import type { CanvasItem } from '../../types/form'

const activeDropZoneStyles = 'bg-primary/5 border-primary/40 shadow-inner shadow-primary/5'
const idleDropZoneStyles = 'bg-transparent border-transparent hover:border-border/20'

export function FormCanvas() {
  const {
    itemIds,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  } = useFormCanvas()

  const itemsData = useFormBuilderStore((state) => state.itemsData)

  const {
    dropTargetRef,
    isDragOver
  } = useCanvasDropTarget()

  if (previewMode && currentFormSchema) {
    return (
      <PreviewFormRenderer
        currentFormSchema={currentFormSchema}
        simulateSubmit={simulateSubmit}
      />
    )
  }

  const canvasItems = itemIds.map((id) => itemsData[id]).filter((item): item is CanvasItem => Boolean(item))
  const dropZoneClassName = isDragOver ? activeDropZoneStyles : idleDropZoneStyles

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <InheritanceProvider onChange={() => { }} getFieldValue={() => undefined}>
        <div
          ref={dropTargetRef}
          className={`space-y-4 min-h-100 p-6 rounded-2xl transition-all duration-300 border-2 border-dashed ${dropZoneClassName}`}
        >
          {canvasItems.length === 0 ? (
            <EmptyCanvasPlaceholder />
          ) : (
            canvasItems.map((item, index) => (
              <CanvasItemRenderer
                key={item.id}
                item={item}
                index={index}
              />
            ))
          )}
        </div>
      </InheritanceProvider>
    </div>
  )
}