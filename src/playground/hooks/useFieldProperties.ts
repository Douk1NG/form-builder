import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { Option } from '../../types/select'

export function useFieldProperties() {
  const formId = useFormBuilderStore((state) => state.formId)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const updateField = useFormBuilderStore((state) => state.updateField)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  
  // By accessing fieldsData[selectedFieldId] directly, this hook only triggers a 
  // re-render if the specifically selected field's properties change, 
  // or if the selectedFieldId changes.
  const selectedField = useFormBuilderStore((state) => 
    selectedFieldId && state.fieldsData ? state.fieldsData[selectedFieldId] : null
  )

  const handleUpdateLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { label: event.target.value })
    }
  }

  const handleUpdateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { name: event.target.value })
    }
  }

  const handleUpdateDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { description: event.target.value })
    }
  }

  const handleUpdatePlaceholder = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { placeholder: event.target.value })
    }
  }

  const handleUpdateReadOnly = (checked: boolean) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { readOnly: checked })
    }
  }

  const handleUpdateDisabled = (checked: boolean) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { disabled: checked })
    }
  }

  const handleUpdateOptions = (options: Option[]) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { options })
    }
  }

  return {
    formId,
    previewMode,
    selectedField,
    handleUpdateLabel,
    handleUpdateName,
    handleUpdateDescription,
    handleUpdatePlaceholder,
    handleUpdateReadOnly,
    handleUpdateDisabled,
    handleUpdateOptions,
  }
}
