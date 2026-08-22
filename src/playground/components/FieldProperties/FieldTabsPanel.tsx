import { Settings2 } from 'lucide-react'
import { useIsMobile } from '@/playground/hooks/useIsMobile'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertiesSectionHeader } from './PropertiesSectionHeader'
import { FieldBasicTab } from './FieldBasicTab'
import { FieldBehaviorTab } from './FieldBehaviorTab'
import { FieldDataTab } from './FieldDataTab'
import { FieldStyleTab } from './FieldStyleTab'
import { LabeledSwitchRow } from './LabeledSwitchRow'
import type { Field, FieldStyle, LocalizedString } from '@/types/form'
import type { Option } from '@/types/select'

export type FieldTabsPanelProps = {
  selectedField: Field
  expandToggle: React.ReactNode
  translations: (key: string) => string
  onLabelChange: (value: LocalizedString) => void
  onNameChange: (name: string) => void
  onDescriptionChange: (value: LocalizedString) => void
  onPlaceholderChange: (value: LocalizedString) => void
  onReadOnlyChange: (checked: boolean) => void
  onDisabledChange: (checked: boolean) => void
  onActionOptionsChange: (options: Option[]) => void
  onFieldStyleChange: (style: FieldStyle) => void
  onAvatarModeChange: (avatarMode: boolean) => void
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
  onFieldStyleChange,
  onAvatarModeChange,
}: FieldTabsPanelProps) {
  const hasOptions = selectedField.type === 'select' || selectedField.type === 'multiselect'
  const isImageField = selectedField.type === 'image'
  const hasAvatarMode = isImageField && 'avatarMode' in selectedField

  const isMobile = useIsMobile()

  return (
    <div className={isMobile ? 'space-y-4' : 'space-y-5'}>
      {!isMobile && (
        <PropertiesSectionHeader icon={<Settings2 className="w-5 h-5" />} title="Field Properties" rightAction={expandToggle} />
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
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
          <TabsTrigger
            value="style"
            type="button"
          >
            Style
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
          {isImageField && (
            <div className="mt-4 border-t border-border/40 pt-4">
              <LabeledSwitchRow
                id="field-avatar-mode"
                label="Avatar Mode"
                description="Display as a circular profile photo instead of a multi-file upload dropzone"
                checked={hasAvatarMode ? (selectedField as Field & { avatarMode?: boolean }).avatarMode ?? false : false}
                onCheckedChange={onAvatarModeChange}
              />
            </div>
          )}
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

        <TabsContent value="style" className="mt-4">
          <FieldStyleTab
            fieldStyle={selectedField.style}
            onFieldStyleChange={onFieldStyleChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
