import { Button } from '@/components/ui/button'
import { EmptyPropertiesPanel } from './EmptyPropertiesPanel'
import { GroupPropertiesPanel } from './GroupPropertiesPanel'
import { FieldTabsPanel } from './FieldTabsPanel'
import { Maximize2, Minimize2 } from 'lucide-react'
import { useFieldProperties } from '@/playground/hooks/useFieldProperties'
import { useTranslation } from 'react-i18next'
import { ITEM_KINDS } from '@/types/itemKinds'

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
    isPropertiesExpanded,
    togglePropertiesExpanded,
    handleUpdateLabel,
    handleUpdateName,
    handleUpdateDescription,
    handleUpdatePlaceholder,
    handleUpdateReadOnly,
    handleUpdateDisabled,
    handleUpdateOptions,
    handleUpdateGroupLabel
  } = useFieldProperties()

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

  if (selectedKind === ITEM_KINDS.FIELD_GROUP && selectedGroup) {
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

  return (
    <FieldTabsPanel
      selectedField={selectedField}
      expandToggle={expandToggle}
      translations={translations}
      onLabelChange={handleUpdateLabel}
      onNameChange={handleUpdateName}
      onDescriptionChange={handleUpdateDescription}
      onPlaceholderChange={handleUpdatePlaceholder}
      onReadOnlyChange={handleUpdateReadOnly}
      onDisabledChange={handleUpdateDisabled}
      onActionOptionsChange={handleUpdateOptions}
    />
  )
}