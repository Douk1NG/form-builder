import type { StateCreator } from 'zustand'
import type { Field, CanvasItem, CanvasField, FieldGroup } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'

export type CanvasListActions = {
    addField: (field: Omit<Field, 'id'>) => void
    addGroup: (label: string) => void
    addRow: (columns: number) => void
    removeCanvasItem: (itemId: string) => void
    reorderItem: (itemId: string, direction: 'up' | 'down') => void
    insertItemAt: (index: number, item: CanvasItem) => void
    moveItem: (sourceIndex: number, destinationIndex: number) => void
}

export const createCanvasListActions: StateCreator<FormBuilderState, [], [], CanvasListActions> = (set, get) => ({
    addField: (field) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newItem: CanvasField = { ...(field as Field), id, kind: 'field' }

        set({
            itemIds: [...itemIds, id],
            itemsData: { ...itemsData, [id]: newItem },
        })
    },

    addGroup: (label) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newGroup: FieldGroup = { id, kind: 'field_group', label, columns: 2, items: [] }

        set({
            itemIds: [...itemIds, id],
            itemsData: { ...itemsData, [id]: newGroup },
        })
    },

    addRow: (columns) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newGroup: FieldGroup = { id, kind: 'field_group', label: `${columns} Columns Row`, columns, items: [] }

        set({
            itemIds: [...itemIds, id],
            itemsData: { ...itemsData, [id]: newGroup },
        })
    },

    removeCanvasItem: (itemId) => {
        const { formId, itemIds, itemsData, selectedItemId } = get()
        if (!formId) return

        const newItemIds = itemIds.filter((id) => id !== itemId)
        const newItemsData = { ...itemsData }
        delete newItemsData[itemId]

        set({
            itemIds: newItemIds,
            itemsData: newItemsData,
            selectedItemId: selectedItemId === itemId ? null : selectedItemId,
        })
    },

    reorderItem: (itemId, direction) => {
        const { formId, itemIds } = get()
        if (!formId) return

        const index = itemIds.indexOf(itemId)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === itemIds.length - 1) return

        const newItemIds = [...itemIds]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        const temporary = newItemIds[index]
        newItemIds[index] = newItemIds[swapIndex]
        newItemIds[swapIndex] = temporary

        set({ itemIds: newItemIds })
    },

    insertItemAt: (index, item) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const newItemIds = [...itemIds]
        newItemIds.splice(index, 0, item.id)

        set({
            itemIds: newItemIds,
            itemsData: { ...itemsData, [item.id]: item },
        })
    },

    moveItem: (sourceIndex, destinationIndex) => {
        const { formId, itemIds } = get()
        if (!formId) return

        const newItemIds = [...itemIds]
        const [movedId] = newItemIds.splice(sourceIndex, 1)
        newItemIds.splice(destinationIndex, 0, movedId)

        set({ itemIds: newItemIds })
    },
})