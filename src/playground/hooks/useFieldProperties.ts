import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { findItemById } from '../utils/findItemById'
import type { Option } from '../../types/select'
import type { Field, FieldGroup, LocalizedString } from '../../types/form'

export type SelectedItemKind = 'field' | 'field_group' | null

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

  const selectedKind: SelectedItemKind = selectedItem?.kind === 'field_group' ? 'field_group' : selectedItem ? 'field' : null

  const selectedField: Field | null = selectedItem?.kind === 'field' ? selectedItem : null
  const selectedGroup: FieldGroup | null = selectedItem?.kind === 'field_group' ? selectedItem : null

  const isFieldSelected = Boolean(selectedItemId) && selectedKind === 'field'
  const isGroupSelected = Boolean(selectedItemId) && selectedKind === 'field_group'

  const handleUpdateLabel = (value: LocalizedString) => {
    if (isFieldSelected) updateField(selectedItemId as string, { label: value })
  }

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isFieldSelected) updateField(selectedItemId as string, { name: event.target.value })
  }

  const handleUpdateDescription = (value: LocalizedString) => {
    if (isFieldSelected) updateField(selectedItemId as string, { description: value })
  }

  const handleUpdatePlaceholder = (value: LocalizedString) => {
    if (isFieldSelected) updateField(selectedItemId as string, { placeholder: value })
  }

  const handleUpdateReadOnly = (checked: boolean) => {
    if (isFieldSelected) updateField(selectedItemId as string, { readOnly: checked })
  }

  const handleUpdateDisabled = (checked: boolean) => {
    if (isFieldSelected) updateField(selectedItemId as string, { disabled: checked })
  }

  const handleUpdateOptions = (options: Option[]) => {
    if (isFieldSelected) updateField(selectedItemId as string, { options })
  }

  const handleUpdateGroupLabel = (value: LocalizedString) => {
    if (isGroupSelected) updateGroup(selectedItemId as string, { label: value })
  }

  return {
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
  }
}