import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { findItemById } from '../utils/findItemById'
import type { Option } from '../../types/select'
import type { Field, FieldGroup, LocalizedString } from '../../types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export type SelectedItemKind = typeof ITEM_KINDS.FIELD | typeof ITEM_KINDS.FIELD_GROUP | null

export function useFieldProperties() {
  const formId = useFormBuilderStore((state) => state.formId)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const updateField = useFormBuilderStore((state) => state.updateField)
  const updateGroup = useFormBuilderStore((state) => state.updateGroup)
  const previewMode = useFormBuilderStore((state) => state.previewMode)

  const selectedItem = useFormBuilderStore((state) => {
    if (!selectedItemId || !state.itemsData) return null
    return findItemById(state.itemsData, selectedItemId)
  })

  let selectedKind: SelectedItemKind = null
  if (selectedItem) {
    selectedKind = selectedItem.kind === ITEM_KINDS.FIELD_GROUP ? ITEM_KINDS.FIELD_GROUP : ITEM_KINDS.FIELD
  }

  const selectedField: Field | null = selectedItem?.kind === ITEM_KINDS.FIELD ? selectedItem : null
  const selectedGroup: FieldGroup | null = selectedItem?.kind === ITEM_KINDS.FIELD_GROUP ? selectedItem : null

  const isFieldSelected = Boolean(selectedItemId) && selectedKind === ITEM_KINDS.FIELD
  const isGroupSelected = Boolean(selectedItemId) && selectedKind === ITEM_KINDS.FIELD_GROUP

  const withFieldGuard = <Value,>(updater: (itemId: string, value: Value) => void) => (value: Value) => {
    if (isFieldSelected && selectedItemId) updater(selectedItemId, value)
  }

  const handleUpdateLabel = withFieldGuard<LocalizedString>((itemId, value) => updateField(itemId, { label: value }))
  const handleUpdateName = withFieldGuard<string>((itemId, name) => updateField(itemId, { name }))
  const handleUpdateDescription = withFieldGuard<LocalizedString>((itemId, value) => updateField(itemId, { description: value }))
  const handleUpdatePlaceholder = withFieldGuard<LocalizedString>((itemId, value) => updateField(itemId, { placeholder: value }))
  const handleUpdateReadOnly = withFieldGuard<boolean>((itemId, checked) => updateField(itemId, { readOnly: checked }))
  const handleUpdateDisabled = withFieldGuard<boolean>((itemId, checked) => updateField(itemId, { disabled: checked }))
  const handleUpdateOptions = withFieldGuard<Option[]>((itemId, options) => updateField(itemId, { options }))

  const handleUpdateGroupLabel = (value: LocalizedString) => {
    if (isGroupSelected && selectedItemId) updateGroup(selectedItemId, { label: value })
  }

  const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)
  const togglePropertiesExpanded = useFormBuilderStore((state) => state.togglePropertiesExpanded)

  return {
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
    handleUpdateGroupLabel,
  }
}