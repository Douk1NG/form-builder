import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType } from '../../types/form'

export function useFormCanvas() {
  const currentForm = useFormBuilderStore((state) => state.currentForm)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId)
  const setSelectedField = useFormBuilderStore((state) => state.setSelectedField)
  const removeField = useFormBuilderStore((state) => state.removeField)
  const reorderField = useFormBuilderStore((state) => state.reorderField)
  const insertFieldAt = useFormBuilderStore((state) => state.insertFieldAt)
  const moveField = useFormBuilderStore((state) => state.moveField)
  const addField = useFormBuilderStore((state) => state.addField)

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const sourceData = source.data
        const destData = destination.data

        if (sourceData.source === 'palette') {
          const field = {
            type: sourceData.type as FieldType,
            label: sourceData.label as string,
            required: false,
          }
          if (destData.isCanvas) {
            addField(field)
          } else if (typeof destData.index === 'number') {
            insertFieldAt(destData.index, field)
          }
        } else if (sourceData.source === 'canvas') {
          if (typeof sourceData.index === 'number' && typeof destData.index === 'number') {
            moveField(sourceData.index, destData.index)
          }
        }
      },
    })
  }, [addField, insertFieldAt, moveField])

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
