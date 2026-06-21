import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useShallow } from 'zustand/react/shallow'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType } from '../../types/form'
import type { FormSchema } from '../store/useFormBuilderStore'

export function useFormCanvas() {
  // `fieldIds` is a primitive string array — useShallow prevents unnecessary
  // re-renders when the array reference changes but the contents are the same.
  const fieldIds = useFormBuilderStore(useShallow((state) => state.fieldIds))
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)
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

  const simulateSubmit = async () => {
    return { success: true, message: 'Simulated submission', data: {} }
  }

  const currentFormSchema: FormSchema | null = previewMode ? getFormSchema() : null

  return {
    fieldIds,
    previewMode,
    currentFormSchema,
    simulateSubmit,
  }
}
