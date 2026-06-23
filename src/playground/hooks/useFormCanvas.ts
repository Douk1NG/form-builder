import { useEffect } from 'react'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { useShallow } from 'zustand/react/shallow'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import type { FieldType } from '@/types/form'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'

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

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const sourceData = source.data
        const destData = destination.data
        const edge = extractClosestEdge(destData)

        if (sourceData.source === 'palette') {
          if (sourceData.type === 'field_group' || sourceData.type === 'column_row') {
            const newGroup = {
              id: crypto.randomUUID(),
              kind: 'field_group' as const,
              label: sourceData.type === 'column_row' ? '2 Columns Row' : 'Field Group',
              columns: 2,
              items: [],
            };

            if (destData.isCanvas) {
              insertItemAt(itemIds.length, newGroup);
            } else if (typeof destData.insertIndex === 'number') {
              insertItemAt(destData.insertIndex as number, newGroup);
            }
          } else {
            const field = {
              type: sourceData.type as FieldType,
              label: sourceData.label as string,
              name: `field_${crypto.randomUUID().slice(0, 8)}`,
              required: false,
            }

            if (edge === 'left' || edge === 'right') {
              createGroupWithNewField(destData.id as string, field, edge)
            } else if (destData.isCanvas) {
              addField(field)
            } else if (typeof destData.insertIndex === 'number') {
              const newItem = { ...field, id: crypto.randomUUID(), kind: 'field' as const }
              insertItemAt(destData.insertIndex as number, newItem)
            } else if (typeof destData.groupId === 'string') {
              addFieldToGroup(destData.groupId as string, field)
            }
          }
        } else if (sourceData.source === 'canvas') {
          if (typeof destData.groupId === 'string') {
            moveFieldToGroup(sourceData.id as string, destData.groupId as string)
          } else if (edge === 'left' || edge === 'right') {
            createGroupFromDrop(sourceData.id as string, destData.id as string, edge)
          } else if (typeof sourceData.index === 'number' && typeof destData.index === 'number') {
            moveItem(sourceData.index as number, destData.index as number)
          }
        }
      },
    })
  }, [addField, insertItemAt, moveItem, addFieldToGroup, createGroupFromDrop, createGroupWithNewField, moveFieldToGroup])

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
