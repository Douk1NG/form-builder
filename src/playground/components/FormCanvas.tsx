import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Plus } from 'lucide-react'
import { useFormCanvas } from '../hooks/useFormCanvas'
import { FieldRenderer } from './FieldRenderer'
import { ColumnRowRenderer } from './ColumnRowRenderer'
import { FieldGroupRenderer } from './FieldGroupRenderer'
import FormBuilder from '../../components/form'
import { InheritanceProvider } from '../../context/InheritanceProvider'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { CanvasItem, Field } from '../../types/form'

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

function flattenItemsToFields(items: CanvasItem[]): Field[] {
  return items.flatMap((canvasItem) => {
    if (canvasItem.kind === 'field') {
      const { kind: _kind, ...fieldWithoutKind } = canvasItem
      return [fieldWithoutKind as Field]
    }
    if (canvasItem.kind === 'column_row') {
      return [canvasItem.leftField, canvasItem.rightField].filter((field): field is Field => field !== null)
    }
    if (canvasItem.kind === 'field_group') {
      return canvasItem.items.flatMap((groupItem) => {
        if (groupItem.kind === 'column_row') {
          return [groupItem.leftField, groupItem.rightField].filter((field): field is Field => field !== null)
        }
        return [groupItem as Field]
      })
    }
    return []
  })
}

export function FormCanvas() {
  const {
    itemIds,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  } = useFormCanvas()

  const itemsData = useFormBuilderStore((state) => state.itemsData)

  const ref = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      getData: () => ({ isCanvas: true }),
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: () => setIsDragOver(false),
    })
  }, [])

  if (previewMode && currentFormSchema) {
    const flatFields = flattenItemsToFields(currentFormSchema.items)

    return (
      <div className="max-w-3xl p-8 mx-auto border rounded-2xl shadow-xl bg-card/80 backdrop-blur-md border-border/50">
        <FormBuilder
          fields={flatFields}
          values={{}}
          action={simulateSubmit}
          isCreating={true}
        />
      </div>
    )
  }

  const canvasItems = itemIds.map((id) => itemsData[id]).filter((item): item is CanvasItem => Boolean(item))

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <InheritanceProvider onChange={() => { }} getFieldValue={() => undefined}>
        <div
          ref={ref}
          className={`space-y-4 min-h-100 p-6 rounded-2xl transition-all duration-300 ${isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary shadow-inner scale-[1.01]' : 'bg-card/40 border-2 border-dashed border-transparent hover:border-border/30'}`}
        >
          {canvasItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-12 text-center border-2 border-dashed rounded-2xl border-border/50 bg-card/30 text-muted-foreground pointer-events-none transition-all">
              <div className="p-4 mb-4 rounded-full bg-primary/10">
                <Plus className="w-8 h-8 text-primary/70" />
              </div>
              <p className="text-lg font-medium">Drag & Drop fields here</p>
              <p className="text-sm mt-1">Select components from the left palette to start building your form</p>
            </div>
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
