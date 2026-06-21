import { useFormBuilderStore } from '../store/useFormBuilderStore'

export function useFieldRenderer(id: string) {
  const field = useFormBuilderStore((state) => state.itemsData ? state.itemsData[id] : null)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const removeCanvasItem = useFormBuilderStore((state) => state.removeCanvasItem)
  const reorderItem = useFormBuilderStore((state) => state.reorderItem)

  const isSelected = selectedItemId === id

  const handleSelect = () => {
    setSelectedItem(id)
  }

  const handleMoveUp = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderItem(id, 'up')
  }

  const handleMoveDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    reorderItem(id, 'down')
  }

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation()
    removeCanvasItem(id)
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
