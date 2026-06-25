import { Settings2, Maximize2, Minimize2 } from 'lucide-react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { Button } from '@/components/ui/button'
import { useFieldProperties } from '@/playground/hooks/useFieldProperties'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyPropertiesPanel } from '@/playground/components/EmptyPropertiesPanel'
import { GroupPropertiesPanel } from '@/playground/components/GroupPropertiesPanel'
import { PropertiesSectionHeader } from '@/playground/components/PropertiesSectionHeader'
import { FieldBasicTab } from '@/playground/components/FieldBasicTab'
import { FieldBehaviorTab } from '@/playground/components/FieldBehaviorTab'
import { FieldDataTab } from '@/playground/components/FieldDataTab'
import { useTranslation } from 'react-i18next'

export function FieldProperties() {

  const { t: translations } = useTranslation('translation', {
    keyPrefix: 'playground.properties.tabs'
  })

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
    handleUpdateGroupLabel
  } = useFieldProperties()

  const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)
  const togglePropertiesExpanded = useFormBuilderStore((state) => state.togglePropertiesExpanded)

  const expandToggle = (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePropertiesExpanded}
      className="h-8 w-8 text-muted-foreground hover:text-foreground">
      {isPropertiesExpanded ?
        <Minimize2 className="h-4 w-4" /> :
        <Maximize2 className="h-4 w-4" />
      }
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

  if (!selectedField) return <EmptyPropertiesPanel />

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
            onLabelChange={handleUpdateLabel}
            onNameChange={handleUpdateName}
            onDescriptionChange={handleUpdateDescription}
            onPlaceholderChange={handleUpdatePlaceholder}
          />
        </TabsContent>

        <TabsContent value="behavior" className="mt-4">
          <FieldBehaviorTab
            readOnly={selectedField.readOnly || false}
            disabled={selectedField.disabled || false}
            onReadOnlyChange={handleUpdateReadOnly}
            onDisabledChange={handleUpdateDisabled}
          />
        </TabsContent>

        {hasOptions && (
          <TabsContent value="data" className="mt-4">
            <FieldDataTab
              options={selectedField.options || []}
              onChange={handleUpdateOptions}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}