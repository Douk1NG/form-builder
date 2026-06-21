import { useFormBuilderStore } from '../store/useFormBuilderStore'

export function useFieldRenderer(id: string) {
  const field = useFormBuilderStore((state) => state.fieldsData ? state.fieldsData[id] : null)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const setSelectedField = useFormBuilderStore((state) => state.setSelectedField)
  const removeField = useFormBuilderStore((state) => state.removeField)
  const reorderField = useFormBuilderStore((state) => state.reorderField)

  const isSelected = selectedFieldId === id

  const handleSelect = () => {
    setSelectedField(id)
  }
  
  const handleMoveUp = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderField(id, 'up')
  }

  const handleMoveDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderField(id, 'down')
  }

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation()
    removeField(id)
  }

  return {
    field,
    isSelected,
    handleSelect,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
  }
}
