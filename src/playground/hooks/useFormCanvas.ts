import { useFormBuilderStore } from '../store/useFormBuilderStore'

export function useFormCanvas() {
  const currentForm = useFormBuilderStore((state) => state.currentForm)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const setSelectedField = useFormBuilderStore((state) => state.setSelectedField)
  const removeField = useFormBuilderStore((state) => state.removeField)
  const reorderField = useFormBuilderStore((state) => state.reorderField)

  const handleSelectField = (fieldId: string) => {
    setSelectedField(fieldId)
  }

  const handleMoveUp = (event: React.MouseEvent, fieldId: string) => {
    event.stopPropagation()
    reorderField(fieldId, 'up')
  }

  const handleMoveDown = (event: React.MouseEvent, fieldId: string) => {
    event.stopPropagation()
    reorderField(fieldId, 'down')
  }

  const handleRemove = (event: React.MouseEvent, fieldId: string) => {
    event.stopPropagation()
    removeField(fieldId)
  }

  const simulateSubmit = async () => {
    return { success: true, message: 'Simulated submission', data: {} }
  }

  return {
    currentForm,
    previewMode,
    selectedFieldId,
    handleSelectField,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
    simulateSubmit,
  }
}
