import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useFormCanvas } from '../hooks/useFormCanvas'
import { CanvasFieldWrapper } from './CanvasFieldWrapper'
import FormBuilder from '../../components/form'
import FieldComponent from '../../components/form/field'
import { InheritanceProvider } from '../../context/InheritanceProvider'

export function FormCanvas() {
  const {
    currentForm,
    previewMode,
    selectedFieldId,
    handleSelectField,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
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

  if (!currentForm) return null

  if (previewMode) {
    return (
      <div className="max-w-2xl p-8 mx-auto border rounded-lg shadow-sm bg-card border-border">
        <h2 className="mb-6 text-2xl font-bold">{currentForm.title}</h2>
        <FormBuilder
          fields={currentForm.fields}
          values={{}}
          action={simulateSubmit}
          isCreating={true}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="p-6 mb-8 border rounded-lg bg-card border-border">
        <h2 className="text-2xl font-bold">{currentForm.title}</h2>
        {currentForm.description && <p className="mt-2 text-muted-foreground">{currentForm.description}</p>}
      </div>

      <InheritanceProvider onChange={() => { }} getFieldValue={() => undefined}>
        <div
          ref={ref}
          className={`space-y-4 min-h-50 p-4 rounded-lg transition-colors ${isDragOver ? 'bg-primary/5 border-2 border-dashed border-primary/50' : ''}`}
        >
          {currentForm.fields.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed rounded-lg border-border text-muted-foreground pointer-events-none">
              Add fields from the palette on the left
            </div>
          ) : (
            currentForm.fields.map((field, index) => (
              <CanvasFieldWrapper
                key={field.id}
                id={field.id as string}
                index={index}
                isSelected={selectedFieldId === field.id}
                onSelect={() => handleSelectField(field.id as string)}
                onMoveUp={(event) => handleMoveUp(event, field.id as string)}
                onMoveDown={(event) => handleMoveDown(event, field.id as string)}
                onRemove={(event) => handleRemove(event, field.id as string)}
              >
                <FieldComponent {...field as Omit<typeof field, 'id'>} />
              </CanvasFieldWrapper>
            ))
          )}
        </div>
      </InheritanceProvider>
    </div>
  )
}
