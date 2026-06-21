import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Plus } from 'lucide-react'
import { useFormCanvas } from '../hooks/useFormCanvas'
import { FieldRenderer } from './FieldRenderer'
import FormBuilder from '../../components/form'
import { InheritanceProvider } from '../../context/InheritanceProvider'

export function FormCanvas() {
  const {
    fieldIds,
    previewMode,
    currentFormSchema,
    simulateSubmit
  } = useFormCanvas()

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
    return (
      <div className="max-w-3xl p-8 mx-auto border rounded-2xl shadow-xl bg-card/80 backdrop-blur-md border-border/50">
        <FormBuilder
          fields={currentFormSchema.fields}
          values={{}}
          action={simulateSubmit}
          isCreating={true}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">

      <InheritanceProvider onChange={() => { }} getFieldValue={() => undefined}>
        <div
          ref={ref}
          className={`space-y-4 min-h-100 p-6 rounded-2xl transition-all duration-300 ${isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary shadow-inner scale-[1.01]' : 'bg-card/40 border-2 border-dashed border-transparent hover:border-border/30'}`}
        >
          {fieldIds.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-12 text-center border-2 border-dashed rounded-2xl border-border/50 bg-card/30 text-muted-foreground pointer-events-none transition-all">
              <div className="p-4 mb-4 rounded-full bg-primary/10">
                <Plus className="w-8 h-8 text-primary/70" />
              </div>
              <p className="text-lg font-medium">Drag & Drop fields here</p>
              <p className="text-sm mt-1">Select components from the left palette to start building your form</p>
            </div>
          ) : (
            fieldIds.map((id, index) => (
              <FieldRenderer
                key={id}
                id={id}
                index={index}
              />
            ))
          )}
        </div>
      </InheritanceProvider>
    </div>
  )
}
