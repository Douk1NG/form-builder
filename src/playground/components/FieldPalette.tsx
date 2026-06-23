import { useFieldPalette } from '../hooks/useFieldPalette'
import { PaletteItem } from './PaletteItem'
import type { FieldType } from '../../types/form'
import { Layers, LayoutTemplate } from 'lucide-react'

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
  const { previewMode, handleAddField, handleAddGroup, handleAddColumnRow } = useFieldPalette()

  if (previewMode) return null

  return (
    <div className="space-y-6">
      {/* Layout section - Positioned prominently */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base tracking-tight text-foreground">Layout & Structure</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PaletteItem
            type="field_group"
            label="Field Group"
            icon="Layers"
            onClick={handleAddGroup}
          />
          <PaletteItem
            type="column_row"
            label="2-Column Row"
            icon="Columns2"
            onClick={handleAddColumnRow}
          />
        </div>
      </div>

      {/* Fields section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base tracking-tight text-foreground">Fields</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
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
    </div>
  )
}

