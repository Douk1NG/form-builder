import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldGroup } from '../../types/form'

export function useFieldGroupRenderer(groupId: string) {
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const removeCanvasItem = useFormBuilderStore((state) => state.removeCanvasItem)
  const removeFieldFromGroup = useFormBuilderStore((state) => state.removeFieldFromGroup)
  const reorderItem = useFormBuilderStore((state) => state.reorderItem)

  const group = useFormBuilderStore((state) => {
    if (!state.itemsData) return null
    const item = state.itemsData[groupId]
    return item?.kind === 'field_group' ? (item as FieldGroup) : null
  })

  const isSelected = selectedItemId === groupId

  const handleSelectGroup = (event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedItem(groupId)
  }

  const handleRemoveGroup = (event: React.MouseEvent) => {
    event.stopPropagation()
    removeCanvasItem(groupId)
  }

  const handleMoveUp = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderItem(groupId, 'up')
  }

  const handleMoveDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderItem(groupId, 'down')
  }

  const handleRemoveFieldFromGroup = (fieldId: string) => (event: React.MouseEvent) => {
    event.stopPropagation()
    removeFieldFromGroup(groupId, fieldId)
  }

  return {
    group,
    isSelected,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
  }
}
