import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { ColumnRow } from '../../types/form'

export type ColumnRowRendererOptions = {
  rowId: string
  groupId?: string
}

export function useColumnRowRenderer({ rowId, groupId }: ColumnRowRendererOptions) {
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const removeCanvasItem = useFormBuilderStore((state) => state.removeCanvasItem)
  const removeColumnRowFromGroup = useFormBuilderStore((state) => state.removeColumnRowFromGroup)
  const removeFieldFromColumnRow = useFormBuilderStore((state) => state.removeFieldFromColumnRow)
  const removeFieldFromGroupColumnRow = useFormBuilderStore((state) => state.removeFieldFromGroupColumnRow)
  const reorderItem = useFormBuilderStore((state) => state.reorderItem)

  const row = useFormBuilderStore((state) => {
    if (!state.itemsData) return null
    if (groupId) {
      const group = state.itemsData[groupId]
      if (!group || group.kind !== 'field_group') return null
      const found = group.items.find((item) => item.kind === 'column_row' && item.id === rowId)
      return (found?.kind === 'column_row' ? found : null) as ColumnRow | null
    }
    const item = state.itemsData[rowId]
    return item?.kind === 'column_row' ? (item as ColumnRow) : null
  })

  const isSelected = selectedItemId === rowId

  const handleSelect = (event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedItem(rowId)
  }

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (groupId) {
      removeColumnRowFromGroup(groupId, rowId)
    } else {
      removeCanvasItem(rowId)
    }
  }

  const handleMoveUp = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!groupId) reorderItem(rowId, 'up')
  }

  const handleMoveDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!groupId) reorderItem(rowId, 'down')
  }

  const handleRemoveFieldFromSlot = (slot: 'leftField' | 'rightField') => (event: React.MouseEvent) => {
    event.stopPropagation()
    if (groupId) {
      removeFieldFromGroupColumnRow(groupId, rowId, slot)
    } else {
      removeFieldFromColumnRow(rowId, slot)
    }
  }

  return {
    row,
    isSelected,
    handleSelect,
    handleRemove,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromSlot,
  }
}
