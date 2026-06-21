import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useShallow } from 'zustand/react/shallow'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType } from '../../types/form'
import type { FormSchema } from '../store/useFormBuilderStore'

export function useFormCanvas() {
  const itemIds = useFormBuilderStore(useShallow((state) => state.itemIds))
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)
  const insertItemAt = useFormBuilderStore((state) => state.insertItemAt)
  const moveItem = useFormBuilderStore((state) => state.moveItem)
  const addField = useFormBuilderStore((state) => state.addField)
  const addFieldToColumnRowSlot = useFormBuilderStore((state) => state.addFieldToColumnRowSlot)
  const addFieldToGroup = useFormBuilderStore((state) => state.addFieldToGroup)
  const addFieldToGroupColumnRowSlot = useFormBuilderStore((state) => state.addFieldToGroupColumnRowSlot)

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
            name: `field_${crypto.randomUUID().slice(0, 8)}`,
            required: false,
          }

          if (destData.isCanvas) {
            addField(field)
          } else if (typeof destData.insertIndex === 'number') {
            const newItem = { ...field, id: crypto.randomUUID(), kind: 'field' as const }
            insertItemAt(destData.insertIndex as number, newItem)
          } else if (typeof destData.columnRowId === 'string' && typeof destData.slot === 'string') {
            if (typeof destData.groupId === 'string') {
              addFieldToGroupColumnRowSlot(
                destData.groupId as string,
                destData.columnRowId as string,
                destData.slot as 'leftField' | 'rightField',
                field
              )
            } else {
              addFieldToColumnRowSlot(
                destData.columnRowId as string,
                destData.slot as 'leftField' | 'rightField',
                field
              )
            }
          } else if (typeof destData.groupId === 'string') {
            addFieldToGroup(destData.groupId as string, field)
          }
        } else if (sourceData.source === 'canvas') {
          if (typeof sourceData.index === 'number' && typeof destData.index === 'number') {
            moveItem(sourceData.index as number, destData.index as number)
          }
        }
      },
    })
  }, [addField, insertItemAt, moveItem, addFieldToColumnRowSlot, addFieldToGroup, addFieldToGroupColumnRowSlot])

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
