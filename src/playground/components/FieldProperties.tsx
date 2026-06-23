import { Settings2, Layers, Columns2, Maximize2, Minimize2 } from 'lucide-react'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { Button } from '../../components/ui/button'
import { useFieldProperties } from '../hooks/useFieldProperties'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Switch } from '../../components/ui/switch'
import { FieldOptionsEditor } from './FieldOptionsEditor'
import { LocalizedInput } from './LocalizedInput'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import type { LocalizedString } from '../../types/form'

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

function GroupPropertiesPanel({ groupLabel, onLabelChange }: { groupLabel: LocalizedString; onLabelChange: (val: LocalizedString) => void }) {
  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Layers className="w-5 h-5" />} title="Group Properties" accentColor="violet" />
      <LocalizedInput
        id="group-label"
        label="Group Label"
        value={groupLabel}
        onChange={onLabelChange}
        placeholder="Group label..."
      />
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
  rightAction?: React.ReactNode
}

function PropertiesSectionHeader({ icon, title, accentColor = 'primary', rightAction }: PropertiesSectionHeaderProps) {
  const backgroundColors = {
    primary: 'bg-primary/10 text-primary',
    violet: 'bg-violet-500/10 text-violet-500',
  }

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between pb-4 border-b border-border/40 bg-card/95 backdrop-blur-sm -mx-5 px-5 pt-0">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${backgroundColors[accentColor]}`}>
          {icon}
        </div>
        <h3 className="font-bold text-base tracking-tight">{title}</h3>
      </div>
      {rightAction}
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

  const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)
  const togglePropertiesExpanded = useFormBuilderStore((state) => state.togglePropertiesExpanded)

  const expandToggle = (
    <Button variant="ghost" size="icon" onClick={togglePropertiesExpanded} className="h-8 w-8 text-muted-foreground hover:text-foreground">
      {isPropertiesExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </Button>
  )

  if (previewMode || !formId) return null

  if (!selectedKind) return <EmptyPropertiesPanel />

  if (selectedKind === 'field_group' && selectedGroup) {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0 z-20">{expandToggle}</div>
        <GroupPropertiesPanel
          groupLabel={selectedGroup.label}
          onLabelChange={handleUpdateGroupLabel}
        />
      </div>
    )
  }

  if (selectedKind === 'column_row') {
    return (
      <div className="relative">
        <div className="absolute top-0 right-0 z-20">{expandToggle}</div>
        <ColumnRowPropertiesPanel />
      </div>
    )
  }

  if (!selectedField) return <EmptyPropertiesPanel />

  const hasOptions = selectedField.type === 'select' || selectedField.type === 'multiselect'

  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Settings2 className="w-5 h-5" />} title="Field Properties" rightAction={expandToggle} />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="data" disabled={!hasOptions}>Data</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <LocalizedInput
            id="field-label"
            label="Label"
            value={selectedField.label}
            onChange={handleUpdateLabel}
            placeholder="Field Label"
          />

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

          <LocalizedInput
            id="field-description"
            label="Description"
            value={selectedField.description}
            onChange={handleUpdateDescription}
            placeholder="Helper text..."
          />

          <LocalizedInput
            id="field-placeholder"
            label="Placeholder"
            value={selectedField.placeholder}
            onChange={handleUpdatePlaceholder}
            placeholder="Placeholder text..."
          />
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4 mt-4">
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
        </TabsContent>

        {hasOptions && (
          <TabsContent value="data" className="space-y-4 mt-4">
            <FieldOptionsEditor
              options={selectedField.options || []}
              onChange={handleUpdateOptions}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
