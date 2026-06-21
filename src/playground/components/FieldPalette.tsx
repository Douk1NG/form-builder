import { useFieldPalette } from '../hooks/useFieldPalette'
import { PaletteItem } from './PaletteItem'
import type { FieldType } from '../../types/form'
import { Layers, Columns2, LayoutTemplate } from 'lucide-react'
import { Button } from '../../components/ui/button'

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
    <div className="space-y-8">
      {/* Fields section */}
      <div className="space-y-4">
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

      {/* Layout section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-border/50">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <LayoutTemplate className="w-5 h-5 text-violet-500" />
          </div>
          <h3 className="font-semibold text-lg">Layout</h3>
        </div>
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="justify-start h-auto px-4 py-3 border-dashed border-violet-400/40 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all shadow-sm gap-2"
            onClick={handleAddGroup}
          >
            <Layers className="h-4 w-4 text-violet-500" />
            <span className="font-medium">Field Group</span>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto px-4 py-3 border-dashed border-violet-400/40 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all shadow-sm gap-2"
            onClick={handleAddColumnRow}
          >
            <Columns2 className="h-4 w-4 text-violet-500" />
            <span className="font-medium">2-Column Row</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
