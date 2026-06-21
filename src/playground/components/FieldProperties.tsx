import { Settings2 } from 'lucide-react'
import { useFieldProperties } from '../hooks/useFieldProperties'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { FieldOptionsEditor } from './FieldOptionsEditor'

export function FieldProperties() {
  const {
    formId,
    previewMode,
    selectedField,
    handleUpdateLabel,
    handleUpdateName,
    handleUpdateDescription,
    handleUpdatePlaceholder,
    handleUpdateReadOnly,
    handleUpdateDisabled,
    handleUpdateOptions,
  } = useFieldProperties()

  if (previewMode || !formId) return null

  if (!selectedField) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <div className="p-4 mb-4 rounded-full bg-primary/10">
          <Settings2 className="w-8 h-8 text-primary/60" />
        </div>
        <p className="text-lg font-medium text-foreground/80">Properties</p>
        <p className="text-sm mt-1">Select a field in the canvas to edit its properties</p>
      </div>
    )
  }

  const hasOptions = selectedField.type === 'select' || selectedField.type === 'multiselect'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border/50">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Field Properties</h3>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={handleUpdateLabel}
            placeholder="Field Label"
            className="transition-all focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-name" className="text-sm font-medium">Name</Label>
          <Input
            id="field-name"
            value={selectedField.name}
            onChange={handleUpdateName}
            placeholder="field_name"
            className="font-mono text-sm transition-all focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-description" className="text-sm font-medium">Description</Label>
          <Input
            id="field-description"
            value={selectedField.description || ''}
            onChange={handleUpdateDescription}
            placeholder="Helper text..."
            className="transition-all focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder" className="text-sm font-medium">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ''}
            onChange={handleUpdatePlaceholder}
            placeholder="Placeholder text..."
            className="transition-all focus:ring-primary/50"
          />
        </div>

        <div className="pt-4 space-y-4 border-t border-border/50">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border/50 transition-all">
            <div className="space-y-0.5">
              <Label htmlFor="field-readonly" className="text-sm font-medium">Read Only</Label>
              <p className="text-xs text-muted-foreground">Prevent user input</p>
            </div>
            <Switch
              id="field-readonly"
              checked={selectedField.readOnly || false}
              onCheckedChange={handleUpdateReadOnly}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-border/50 transition-all">
            <div className="space-y-0.5">
              <Label htmlFor="field-disabled" className="text-sm font-medium">Disabled</Label>
              <p className="text-xs text-muted-foreground">Disable field interaction</p>
            </div>
            <Switch
              id="field-disabled"
              checked={selectedField.disabled || false}
              onCheckedChange={handleUpdateDisabled}
            />
          </div>
        </div>

        {hasOptions && (
          <div className="pt-4 border-t border-border/50">
            <FieldOptionsEditor
              options={selectedField.options || []}
              onChange={handleUpdateOptions}
            />
          </div>
        )}
      </div>
    </div>
  )
}
