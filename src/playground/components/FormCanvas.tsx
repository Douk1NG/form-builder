import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { MousePointerClick } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFormCanvas } from '../hooks/useFormCanvas'
import { FieldRenderer } from './FieldRenderer'
import { ColumnRowRenderer } from './ColumnRowRenderer'
import { FieldGroupRenderer } from './FieldGroupRenderer'
import FormBuilder from '../../components/form'
import { InheritanceProvider } from '../../context/InheritanceProvider'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { CanvasItem } from '../../types/form'

function CanvasItemRenderer({ item, index }: { item: CanvasItem; index: number }) {
  if (item.kind === 'field') {
    return <FieldRenderer id={item.id ?? ''} index={index} />
  }
  if (item.kind === 'column_row') {
    return <ColumnRowRenderer rowId={item.id} index={index} />
  }
  if (item.kind === 'field_group') {
    return <FieldGroupRenderer groupId={item.id} index={index} />
  }
  return null
}



function EmptyCanvasPlaceholder() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-64 p-12 text-center rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 text-muted-foreground pointer-events-none">
      <div className="p-4 mb-4 rounded-2xl bg-primary/5">
        <MousePointerClick className="w-8 h-8 text-primary/50" />
      </div>
      <p className="text-base font-semibold text-foreground/60">{t('builder.dragDropTitle' as any)}</p>
      <p className="text-sm mt-1.5 text-muted-foreground/70 max-w-xs">
        {t('builder.dragDropDescription' as any)}
      </p>
    </div>
  )
}

export function FormCanvas() {
  const {
    itemIds,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  } = useFormCanvas()

  const itemsData = useFormBuilderStore((state) => state.itemsData)

  const dropTargetRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const element = dropTargetRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => ({ isCanvas: true }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    })
  }, [])

  if (previewMode && currentFormSchema) {
    return (
      <div className="max-w-3xl p-8 mx-auto border rounded-2xl shadow-lg shadow-black/5 bg-card/90 backdrop-blur-md border-border/50">
        <FormBuilder
          fields={currentFormSchema.items}
          values={{}}
          action={simulateSubmit}
          isCreating={true}
        />
      </div>
    )
  }

  const canvasItems = itemIds.map((id) => itemsData[id]).filter((item): item is CanvasItem => Boolean(item))

  const activeDropZoneStyles = 'bg-primary/5 border-primary/40 shadow-inner shadow-primary/5'
  const idleDropZoneStyles = 'bg-transparent border-transparent hover:border-border/20'

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <InheritanceProvider onChange={() => { }} getFieldValue={() => undefined}>
        <div
          ref={dropTargetRef}
          className={`space-y-4 min-h-100 p-6 rounded-2xl transition-all duration-300 border-2 border-dashed ${isDragOver ? activeDropZoneStyles : idleDropZoneStyles
            }`}
        >
          {canvasItems.length === 0 ? (
            <EmptyCanvasPlaceholder />
          ) : (
            canvasItems.map((item, index) => (
              <CanvasItemRenderer key={item.id} item={item} index={index} />
            ))
          )}
        </div>
      </InheritanceProvider>
    </div>
  )
}
