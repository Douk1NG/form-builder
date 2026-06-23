import { useFieldPalette } from '../hooks/useFieldPalette'
import { PaletteItem } from './PaletteItem'
import type { FieldType } from '../../types/form'
import { Layers, Columns2, LayoutTemplate } from 'lucide-react'

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
      {/* Layout section - Positioned prominently */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/40">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base tracking-tight text-foreground">Layout & Structure</h3>
        </div>
        <div className="grid gap-2">
          <button
            onClick={handleAddGroup}
            className="flex items-start text-left p-3 rounded-xl border border-violet-500/20 hover:border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/10 transition-all duration-200 shadow-xs group gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-200">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <span className="block font-bold text-sm text-foreground mb-0.5">Field Group</span>
              <span className="block text-xs text-muted-foreground leading-normal">
                Group related fields into sections with custom headers.
              </span>
            </div>
          </button>

          <button
            onClick={handleAddColumnRow}
            className="flex items-start text-left p-3 rounded-xl border border-violet-500/20 hover:border-violet-500/50 bg-violet-500/5 hover:bg-violet-500/10 transition-all duration-200 shadow-xs group gap-3 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-200">
              <Columns2 className="h-4 w-4" />
            </div>
            <div>
              <span className="block font-bold text-sm text-foreground mb-0.5">2-Column Row</span>
              <span className="block text-xs text-muted-foreground leading-normal">
                Place two fields side-by-side in a responsive layout.
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

