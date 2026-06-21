import { Settings2, Layers, Columns2, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useFieldProperties } from '../hooks/useFieldProperties'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { FieldOptionsEditor } from './FieldOptionsEditor'

function EmptyPropertiesPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
      <div className="p-4 mb-4 rounded-2xl bg-primary/5">
        <Settings2 className="w-8 h-8 text-primary/40" />
      </div>
      <p className="text-base font-semibold text-foreground/70">Properties</p>
      <p className="text-sm mt-1 text-muted-foreground/70">Select a field in the canvas to edit its properties</p>
    </div>
  )
}

function GroupPropertiesPanel({ groupLabel, onLabelChange }: { groupLabel: string; onLabelChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Layers className="w-5 h-5" />} title="Group Properties" accentColor="violet" />
      <div className="space-y-2">
        <Label htmlFor="group-label" className="text-sm font-medium">Group Label</Label>
        <Input
          id="group-label"
          value={groupLabel}
          onChange={onLabelChange}
          placeholder="Group label..."
          className="transition-all focus:ring-violet-500/30 rounded-lg"
        />
      </div>
    </div>
  )
}

function ColumnRowPropertiesPanel() {
  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Columns2 className="w-5 h-5" />} title="Column Row" accentColor="violet" />
      <p className="text-sm text-muted-foreground leading-relaxed">
        This is a 2-column layout row. Drag fields from the palette onto the left and right slots to fill the columns.
      </p>
    </div>
  )
}

type PropertiesSectionHeaderProps = {
  icon: React.ReactNode
  title: string
  accentColor?: 'primary' | 'violet'
}

function PropertiesSectionHeader({ icon, title, accentColor = 'primary' }: PropertiesSectionHeaderProps) {
  const backgroundColors = {
    primary: 'bg-primary/10 text-primary',
    violet: 'bg-violet-500/10 text-violet-500',
  }

  return (
    <div className="flex items-center gap-2.5 pb-4 border-b border-border/40">
      <div className={`p-2 rounded-lg ${backgroundColors[accentColor]}`}>
        {icon}
      </div>
      <h3 className="font-bold text-base tracking-tight">{title}</h3>
    </div>
  )
}

type CollapsibleSectionProps = {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border/30 rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground/80 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 py-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export function FieldProperties() {
  const {
    formId,
    previewMode,
    selectedKind,
    selectedField,
    selectedGroup,
    handleUpdateLabel,
    handleUpdateName,
    handleUpdateDescription,
    handleUpdatePlaceholder,
    handleUpdateReadOnly,
    handleUpdateDisabled,
    handleUpdateOptions,
    handleUpdateGroupLabel,
  } = useFieldProperties()

  if (previewMode || !formId) return null

  if (!selectedKind) return <EmptyPropertiesPanel />

  if (selectedKind === 'field_group' && selectedGroup) {
    return (
      <GroupPropertiesPanel
        groupLabel={selectedGroup.label}
        onLabelChange={handleUpdateGroupLabel}
      />
    )
  }

  if (selectedKind === 'column_row') {
    return <ColumnRowPropertiesPanel />
  }

  if (!selectedField) return <EmptyPropertiesPanel />

  const hasOptions = selectedField.type === 'select' || selectedField.type === 'multiselect'

  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Settings2 className="w-5 h-5" />} title="Field Properties" />

      <CollapsibleSection title="Basic Settings">
        <div className="space-y-2">
          <Label htmlFor="field-label" className="text-sm font-medium">Label</Label>
          <Input
            id="field-label"
            value={selectedField.label}
            onChange={handleUpdateLabel}
            placeholder="Field Label"
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-name" className="text-sm font-medium">Name</Label>
          <Input
            id="field-name"
            value={selectedField.name}
            onChange={handleUpdateName}
            placeholder="field_name"
            className="font-mono text-sm transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-description" className="text-sm font-medium">Description</Label>
          <Input
            id="field-description"
            value={selectedField.description || ''}
            onChange={handleUpdateDescription}
            placeholder="Helper text..."
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field-placeholder" className="text-sm font-medium">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={selectedField.placeholder || ''}
            onChange={handleUpdatePlaceholder}
            placeholder="Placeholder text..."
            className="transition-all focus:ring-primary/30 rounded-lg"
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Behavior">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-all">
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

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30 hover:border-border/50 transition-all">
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
      </CollapsibleSection>

      {hasOptions && (
        <CollapsibleSection title="Options">
          <FieldOptionsEditor
            options={selectedField.options || []}
            onChange={handleUpdateOptions}
          />
        </CollapsibleSection>
      )}
    </div>
  )
}
