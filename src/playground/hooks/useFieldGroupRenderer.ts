import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import type { FieldGroup, CanvasItem } from '@/types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

function findGroupById(items: Record<string, CanvasItem>, groupId: string): FieldGroup | null {
  for (const item of Object.values(items)) {
    if (item.kind !== ITEM_KINDS.FIELD_GROUP) continue
    if (item.id === groupId) return item as FieldGroup

    const nested = findGroupById(
      Object.fromEntries(item.items.map((child) => [child.id, child])),
      groupId
    )
    if (nested) return nested
  }

  return null
}

export function useFieldGroupRenderer(groupId: string) {
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const removeCanvasItem = useFormBuilderStore((state) => state.removeCanvasItem)
  const removeFieldFromGroup = useFormBuilderStore((state) => state.removeFieldFromGroup)
  const reorderItem = useFormBuilderStore((state) => state.reorderItem)

  const group = useFormBuilderStore((state) => {
    if (!state.itemsData) return null
    return findGroupById(state.itemsData, groupId)
  })

  const isSelected = selectedItemId === groupId

  const handleSelectGroup = (event: React.MouseEvent | React.KeyboardEvent) => {
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