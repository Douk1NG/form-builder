import { useFieldPalette } from '../hooks/useFieldPalette'
import { Button } from '../../components/ui/button'
import type { FieldType } from '../../types/form'

const FIELD_TYPES: Array<{ type: FieldType; label: string; icon: string }> = [
  { type: 'text', label: 'Text Input', icon: 'Type' },
  { type: 'textarea', label: 'Text Area', icon: 'AlignLeft' },
  { type: 'number', label: 'Number', icon: 'Hash' },
  { type: 'select', label: 'Select', icon: 'List' },
  { type: 'multiselect', label: 'Multi Select', icon: 'ListChecks' },
  { type: 'currency', label: 'Currency', icon: 'DollarSign' },
  { type: 'switch', label: 'Switch', icon: 'ToggleRight' },
  { type: 'tagbox', label: 'Tags', icon: 'Tags' },
  { type: 'image', label: 'Image Upload', icon: 'Image' },
]

export function FieldPalette() {
  const { previewMode, handleAddField } = useFieldPalette()

  if (previewMode) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Add Fields</h3>
      <div className="grid gap-2">
        {FIELD_TYPES.map((fieldType) => (
          <Button
            key={fieldType.type}
            variant="outline"
            className="justify-start h-auto px-4 py-3"
            onClick={() => handleAddField(fieldType.type, fieldType.label)}
          >
            {fieldType.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
