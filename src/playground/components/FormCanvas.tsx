import { useFormCanvas } from '../hooks/useFormCanvas'
import { CanvasFieldWrapper } from './CanvasFieldWrapper'
import FormBuilder from '../../components/form'
import FieldComponent from '../../components/form/field'

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

  if (!currentForm) return null

  if (previewMode) {
    return (
      <div className="max-w-2xl p-8 mx-auto border rounded-lg shadow-sm bg-card border-border">
        <h2 className="mb-6 text-2xl font-bold">{currentForm.title}</h2>
        <FormBuilder 
          fields={currentForm.fields} 
          values={{}} 
          action={simulateSubmit} 
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

      <div className="space-y-4">
        {currentForm.fields.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed rounded-lg border-border text-muted-foreground">
            Add fields from the palette on the left
          </div>
        ) : (
          currentForm.fields.map((field) => (
            <CanvasFieldWrapper
              key={field.id}
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
    </div>
  )
}
