import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useShallow } from 'zustand/react/shallow'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'
import { handleCanvasDrop } from '../utils/handleCanvasDrop'

export function useFormCanvas() {
  const itemIds = useFormBuilderStore(useShallow((state) => state.itemIds))
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)
  const insertItemAt = useFormBuilderStore((state) => state.insertItemAt)
  const moveItem = useFormBuilderStore((state) => state.moveItem)
  const addField = useFormBuilderStore((state) => state.addField)
  const addFieldToGroup = useFormBuilderStore((state) => state.addFieldToGroup)
  const createGroupFromDrop = useFormBuilderStore((state) => state.createGroupFromDrop)
  const createGroupWithNewField = useFormBuilderStore((state) => state.createGroupWithNewField)
  const moveFieldToGroup = useFormBuilderStore((state) => state.moveFieldToGroup)
  const mergeGroupIntoGroup = useFormBuilderStore((state) => state.mergeGroupIntoGroup)
  const itemsData = useFormBuilderStore((state) => state.itemsData)

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) return

        handleCanvasDrop({
          sourceData: source.data,
          destinationData: destination.data,
          itemIds,
          itemsData,
          insertItemAt,
          moveItem,
          addField,
          addFieldToGroup,
          createGroupFromDrop,
          createGroupWithNewField,
          moveFieldToGroup,
          mergeGroupIntoGroup,
        })
      },
    })
  }, [
    addField,
    insertItemAt,
    moveItem,
    addFieldToGroup,
    createGroupFromDrop,
    createGroupWithNewField,
    moveFieldToGroup,
    mergeGroupIntoGroup,
    itemsData,
    itemIds
  ])

  const simulateSubmit = async () => {
    return { success: true, message: 'Simulated submission', data: {} }
  }

  const currentFormSchema: FormSchema | null = previewMode ? getFormSchema() : null

  return {
    itemIds,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  }
}