import { useFieldPalette } from '../hooks/useFieldPalette'
import { PaletteItem } from './PaletteItem'
import type { FieldType } from '../../types/form'

import { Layers } from 'lucide-react'

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
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <div className="p-2 rounded-lg bg-primary/10">
          <Layers className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Add Fields</h3>
      </div>
      <div className="grid gap-3">
        {FIELD_TYPES.map((fieldType) => (
          <PaletteItem
            key={fieldType.type}
            type={fieldType.type}
            label={fieldType.label}
            icon={fieldType.icon}
            onClick={() => handleAddField(fieldType.type, fieldType.label)}
          />
        ))}
      </div>
    </div>
  )
}
