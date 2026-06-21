import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { Field } from '../../types/form'

export function useFieldProperties() {
  const currentForm = useFormBuilderStore((state) => state.currentForm)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const updateField = useFormBuilderStore((state) => state.updateField)
  const previewMode = useFormBuilderStore((state) => state.previewMode)

  const selectedField = currentForm?.fields.find(
    (field: Field) => field.id === selectedFieldId
  )

  const handleUpdateLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { label: event.target.value })
    }
  }

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { name: event.target.value })
    }
  }

  const handleUpdateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { description: event.target.value })
    }
  }

  const handleUpdatePlaceholder = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { placeholder: event.target.value })
    }
  }

  const handleUpdateReadOnly = (checked: boolean) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { readOnly: checked })
    }
  }

  const handleUpdateDisabled = (checked: boolean) => {
    if (selectedField?.id) {
      updateField(selectedField.id, { disabled: checked })
    }
  }

  return {
    previewMode,
    selectedField,
    handleUpdateLabel,
    handleUpdateName,
    handleUpdateDescription,
    handleUpdatePlaceholder,
    handleUpdateReadOnly,
    handleUpdateDisabled,
  }
}
