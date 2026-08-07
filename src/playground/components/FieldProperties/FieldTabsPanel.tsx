import { Settings2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertiesSectionHeader } from './PropertiesSectionHeader'
import { FieldBasicTab } from './FieldBasicTab'
import { FieldBehaviorTab } from './FieldBehaviorTab'
import { FieldDataTab } from './FieldDataTab'
import type { Field, LocalizedString } from '@/types/form'
import type { Option } from '@/types/select'

export type FieldTabsPanelProps = {
  selectedField: Field
  expandToggle: React.ReactNode
  translations: (key: string) => string
  onLabelChange: (value: LocalizedString) => void
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (value: LocalizedString) => void
  onPlaceholderChange: (value: LocalizedString) => void
  onReadOnlyChange: (checked: boolean) => void
  onDisabledChange: (checked: boolean) => void
  onActionOptionsChange: (options: Option[]) => void
}

export function FieldTabsPanel({
  selectedField,
  expandToggle,
  translations,
  onLabelChange,
  onNameChange,
  onDescriptionChange,
  onPlaceholderChange,
  onReadOnlyChange,
  onDisabledChange,
  onActionOptionsChange,
}: FieldTabsPanelProps) {
  const hasOptions = selectedField.type === 'select' || selectedField.type === 'multiselect'

  return (
    <div className="space-y-5">
      <PropertiesSectionHeader icon={<Settings2 className="w-5 h-5" />} title="Field Properties" rightAction={expandToggle} />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="basic"
            type="button"
          >
            {translations('basic')}
          </TabsTrigger>
          <TabsTrigger
            value="behavior"
            type="button"
          >
            {translations('behavior')}
          </TabsTrigger>
          <TabsTrigger
            value="data"
            disabled={!hasOptions}
            type="button"
          >
            {translations('data')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <FieldBasicTab
            label={selectedField.label}
            name={selectedField.name}
            description={selectedField.description}
            placeholder={selectedField.placeholder}
            onLabelChange={onLabelChange}
            onNameChange={onNameChange}
            onDescriptionChange={onDescriptionChange}
            onPlaceholderChange={onPlaceholderChange}
          />
        </TabsContent>

        <TabsContent value="behavior" className="mt-4">
          <FieldBehaviorTab
            readOnly={selectedField.readOnly || false}
            disabled={selectedField.disabled || false}
            onReadOnlyChange={onReadOnlyChange}
            onDisabledChange={onDisabledChange}
          />
        </TabsContent>

        {hasOptions && (
          <TabsContent value="data" className="mt-4">
            <FieldDataTab
              options={selectedField.options || []}
              onChange={onActionOptionsChange}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
