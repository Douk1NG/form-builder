import { useFieldProperties } from '../hooks/useFieldProperties'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { FieldOptionsEditor } from './FieldOptionsEditor'

export function FieldProperties() {
  const {
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

  if (previewMode || !selectedField) {
    return (
      <div className="p-4 text-sm text-center text-muted-foreground">
        {previewMode ? 'Properties disabled in preview mode' : 'Select a field to edit properties'}
      </div>
    )
  }

  const hasOptions = [
    'select',
    'multiselect',
    'tagbox',
    'group_variant_inventory',
    'group_variant_product',
  ].includes(selectedField.type)

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold">Field Properties</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Label</Label>
          <Input 
            value={selectedField.label || ''} 
            onChange={handleUpdateLabel}
          />
        </div>

        <div className="space-y-2">
          <Label>Name (Field ID)</Label>
          <Input 
            value={selectedField.name || ''} 
            onChange={handleUpdateName}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input 
            value={selectedField.description || ''} 
            onChange={handleUpdateDescription}
          />
        </div>

        <div className="space-y-2">
          <Label>Placeholder</Label>
          <Input 
            value={selectedField.placeholder || ''} 
            onChange={handleUpdatePlaceholder}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Read Only</Label>
          <Switch 
            checked={!!selectedField.readOnly}
            onCheckedChange={handleUpdateReadOnly}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Disabled</Label>
          <Switch 
            checked={!!selectedField.disabled}
            onCheckedChange={handleUpdateDisabled}
          />
        </div>

        {hasOptions && (
          <div className="pt-4 border-t">
            <FieldOptionsEditor
              options={'options' in selectedField && Array.isArray(selectedField.options) ? selectedField.options : []}
              onChange={handleUpdateOptions}
            />
          </div>
        )}
      </div>
    </div>
  )
}
