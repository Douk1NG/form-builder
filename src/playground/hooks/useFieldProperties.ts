import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { Option } from '../../types/select'
import type { Field, CanvasField, FieldGroup, LocalizedString } from '../../types/form'

export type SelectedItemKind = 'field' | 'field_group' | null

export function useFieldProperties() {
  const formId = useFormBuilderStore((state) => state.formId)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const updateField = useFormBuilderStore((state) => state.updateField)
  const updateGroup = useFormBuilderStore((state) => state.updateGroup)
  const previewMode = useFormBuilderStore((state) => state.previewMode)

  const selectedItem = useFormBuilderStore((state) => {
    if (!selectedItemId || !state.itemsData) return null

    const topLevelMatch = state.itemsData[selectedItemId]
    if (topLevelMatch) return topLevelMatch

    for (const item of Object.values(state.itemsData)) {
      if (item.kind === 'field_group') {
        for (const groupItem of item.items) {
          if (groupItem.kind === 'field_group') {
            if (groupItem.id === selectedItemId) return groupItem
          } else if (groupItem.id === selectedItemId) {
            return groupItem
          }
        }
      }
    }

    return null
  })

  const selectedKind: SelectedItemKind = (() => {
    if (!selectedItem) return null
    if (selectedItem.kind === 'field_group') return 'field_group'
    return 'field'
  })()

  const selectedField: Field | null =
    selectedKind === 'field' ? (selectedItem as CanvasField) : null

  const selectedGroup: FieldGroup | null =
    selectedKind === 'field_group' ? (selectedItem as FieldGroup) : null

  const handleUpdateLabel = (value: LocalizedString) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { label: value })
    }
  }

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { name: event.target.value })
    }
  }

  const handleUpdateDescription = (value: LocalizedString) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { description: value })
    }
  }

  const handleUpdatePlaceholder = (value: LocalizedString) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { placeholder: value })
    }
  }

  const handleUpdateReadOnly = (checked: boolean) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { readOnly: checked })
    }
  }

  const handleUpdateDisabled = (checked: boolean) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { disabled: checked })
    }
  }

  const handleUpdateOptions = (options: Option[]) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { options })
    }
  }

  const handleUpdateGroupLabel = (value: LocalizedString) => {
    if (selectedItemId && selectedKind === 'field_group') {
      updateGroup(selectedItemId, { label: value })
    }
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
