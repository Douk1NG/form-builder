import { handleCanvasDrop } from '../utils/handleCanvasDrop'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect } from 'react'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useShallow } from 'zustand/react/shallow'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'
import type { CanvasItem } from '@/types/form'

export function useFormCanvas() {
  const itemIds = useFormBuilderStore(useShallow((state) => state.itemIds))
  const itemsData = useFormBuilderStore((state) => state.itemsData)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const currentState = useFormBuilderStore.getState()

        handleCanvasDrop({
          sourceData: source.data,
          destinationData: destination.data,
          itemIds: currentState.itemIds,
          itemsData: currentState.itemsData,
          insertItemAt: currentState.insertItemAt,
          moveItem: currentState.moveItem,
          moveCanvasItem: currentState.moveCanvasItem,
          addField: currentState.addField,
          addFieldToGroup: currentState.addFieldToGroup,
          addGroupToGroup: currentState.addGroupToGroup,
          addRowToGroup: currentState.addRowToGroup,
          createGroupFromDrop: currentState.createGroupFromDrop,
          createGroupWithNewField: currentState.createGroupWithNewField,
          moveFieldToGroup: currentState.moveFieldToGroup,
          mergeGroupIntoGroup: currentState.mergeGroupIntoGroup,
        })
      },
    })
  }, [])

  const simulateSubmit = async () => {
    return { success: true, message: 'Simulated submission', data: {} }
  }

  const currentFormSchema: FormSchema | null = previewMode ? getFormSchema() : null
  const canvasItems =
    itemIds
      .map((id) => itemsData[id])
      .filter((item): item is CanvasItem => Boolean(item))

  return {
    canvasItems,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  }
}