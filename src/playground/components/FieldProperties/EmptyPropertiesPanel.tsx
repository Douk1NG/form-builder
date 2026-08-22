import { Settings2, Paintbrush } from 'lucide-react'
import { useFormProperties } from '@/playground/hooks/useFormProperties'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PropertiesSectionHeader } from './PropertiesSectionHeader'

export function EmptyPropertiesPanel() {
  const {
    formId,
    formTitle,
    formStyle,
    handleTitleChange,
    handleStyleChange
  } = useFormProperties()

  if (!formId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
        <div className="p-4 mb-4 rounded-2xl bg-primary/5">
          <Settings2 className="w-8 h-8 text-primary/40" />
        </div>
        <p className="text-base font-semibold text-foreground/70">No Form Selected</p>
        <p className="text-sm mt-1 text-muted-foreground/70">Create or select a form to start editing</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PropertiesSectionHeader
        icon={<Settings2 className="w-5 h-5" />}
        title="Form Settings"
        accentColor="indigo"
      />

      {/* Form Title */}
      <div className="space-y-2">
        <Label htmlFor="form-settings-title" className="text-sm font-medium">Form Title</Label>
        <Input
          id="form-settings-title"
          value={formTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Enter form title..."
          className="transition-all focus:ring-primary/30 rounded-lg"
        />
      </div>

      <div className="border-t border-border/40 pt-5 space-y-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Paintbrush className="w-4 h-4" />
          <h4 className="text-xs font-semibold uppercase tracking-wider">Form Theme</h4>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label htmlFor="form-bg-color" className="text-sm font-medium">Background Color</Label>
          <Input
            id="form-bg-color"
            value={formStyle?.backgroundColor ?? ''}
            onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
            placeholder="e.g. #f5f0e8 or cream"
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        {/* Typography family */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Family</Label>
          <Select
            value={formStyle?.fontFamily ?? 'sans'}
            onValueChange={(val) => handleStyleChange('fontFamily', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans Serif (Plus Jakarta)</SelectItem>
              <SelectItem value="serif">Serif (Playfair/Georgia)</SelectItem>
              <SelectItem value="mono">Monospace (Fira Code)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}