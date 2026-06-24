import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { MousePointerClick } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useFormCanvas } from '../hooks/useFormCanvas'
import { FieldRenderer } from './FieldRenderer'
import { FieldGroupRenderer } from './FieldGroupRenderer'
import FormBuilder from '../../components/form'
import { InheritanceProvider } from '../../context/InheritanceProvider'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'
import type { CanvasItem, ActionResponse } from '../../types/form'

type PreviewFormRendererProps = {
  currentFormSchema: FormSchema
  simulateSubmit: (id: string | undefined, previousState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
}

function PreviewFormRenderer({ currentFormSchema, simulateSubmit }: PreviewFormRendererProps) {
  const previewLocale = useFormBuilderStore((state) => state.previewLocale)
  const previewDevice = useFormBuilderStore((state) => state.previewDevice)
  const { t } = useTranslation()

  let deviceMaxWidth = 'max-w-4xl'
  let frameClasses = ''
  let header = null

  if (previewDevice === 'desktop') {
    frameClasses = 'border rounded-xl shadow-2xl shadow-black/10 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50'
    header = (
      <div className="bg-muted/40 border-b border-border/40 px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400/80" />
        <div className="w-3 h-3 rounded-full bg-amber-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-400/80" />
      </div>
    )
  } else if (previewDevice === 'tablet') {
    deviceMaxWidth = 'max-w-2xl'
    frameClasses = 'border-[8px] rounded-[2.5rem] shadow-2xl shadow-black/15 overflow-hidden bg-card border-zinc-800 dark:border-zinc-900'
  } else if (previewDevice === 'mobile') {
    deviceMaxWidth = 'max-w-[375px]'
    frameClasses = 'border-[12px] border-b-[36px] border-t-[36px] rounded-[3rem] shadow-2xl shadow-black/15 overflow-hidden bg-card border-zinc-800 dark:border-zinc-900'
  }

  return (
    <div className="min-h-[calc(100vh-100px)] p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px] -m-8 flex items-start justify-center">
      <div className={`w-full transition-all duration-300 ease-in-out ${deviceMaxWidth}`}>
        <div className={frameClasses}>
          {header}
          <div className="p-8 h-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <FormBuilder
              fields={currentFormSchema.items}
              values={{}}
              locale={previewLocale}
              // @ts-expect-error - dynamic key for translation
              translate={(key: string) => String(t(key))}
              action={simulateSubmit}
              isCreating={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CanvasItemRenderer({ item, index }: { item: CanvasItem; index: number }) {
  if (item.kind === 'field') {
    return <FieldRenderer id={item.id ?? ''} index={index} />
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
        {t('builder.dragDropDescription')}
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
      <PreviewFormRenderer
        currentFormSchema={currentFormSchema}
        simulateSubmit={simulateSubmit}
      />
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
