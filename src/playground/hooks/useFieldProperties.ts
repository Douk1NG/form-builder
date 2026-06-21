import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { Option } from '../../types/select'
import type { Field, CanvasField, FieldGroup, ColumnRow } from '../../types/form'

export type SelectedItemKind = 'field' | 'field_group' | 'column_row' | null

export function useFieldProperties() {
  const formId = useFormBuilderStore((state) => state.formId)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const updateField = useFormBuilderStore((state) => state.updateField)
  const updateGroup = useFormBuilderStore((state) => state.updateGroup)
  const previewMode = useFormBuilderStore((state) => state.previewMode)

  const selectedItem = useFormBuilderStore((state) => {
    if (!selectedItemId || !state.itemsData) return null
    return state.itemsData[selectedItemId] ?? null
  })

  const selectedKind: SelectedItemKind = (() => {
    if (!selectedItem) return null
    if (selectedItem.kind === 'field_group') return 'field_group'
    if (selectedItem.kind === 'column_row') return 'column_row'
    return 'field'
  })()

  const selectedField: Field | null =
    selectedKind === 'field' ? (selectedItem as CanvasField) : null

  const selectedGroup: FieldGroup | null =
    selectedKind === 'field_group' ? (selectedItem as FieldGroup) : null

  const selectedColumnRow: ColumnRow | null =
    selectedKind === 'column_row' ? (selectedItem as ColumnRow) : null

  const handleUpdateLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { label: event.target.value })
    }
  }

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { name: event.target.value })
    }
  }

  const handleUpdateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { description: event.target.value })
    }
  }

  const handleUpdatePlaceholder = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field') {
      updateField(selectedItemId, { placeholder: event.target.value })
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

  const handleUpdateGroupLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItemId && selectedKind === 'field_group') {
      updateGroup(selectedItemId, { label: event.target.value })
    }
  }

  return {
    formId,
    previewMode,
    selectedKind,
    selectedField,
    selectedGroup,
    selectedColumnRow,
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
