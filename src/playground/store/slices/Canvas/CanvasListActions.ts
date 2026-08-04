import type { StateCreator } from 'zustand'
import type { Field, CanvasItem, CanvasField, FieldGroup } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'
import {
    removeFieldFromGroupItems,
    removeItemFromTree,
    insertItemIntoTree
} from '@/playground/store/CanvasItemTree'
import { isDescendantOrSelf } from '@/playground/utils/findItemById'

export type CanvasListActions = {
    addField: (field: Omit<Field, 'id'>) => void
    addGroup: (label: string) => void
    addRow: (columns: number) => void
    removeCanvasItem: (itemId: string) => void
    reorderItem: (itemId: string, direction: 'up' | 'down') => void
    insertItemAt: (index: number, item: CanvasItem) => void
    moveItem: (sourceIndex: number, destinationIndex: number) => void
    moveCanvasItem: (sourceId: string, targetId: string, edge: 'top' | 'bottom' | 'left' | 'right') => void
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
        const newGroup: FieldGroup = { id, kind: 'field_group', label, items: [] }

        set({
            itemIds: [...itemIds, id],
            itemsData: { ...itemsData, [id]: newGroup },
            lockedGroupId: id,
            selectedItemId: id,
        })
    },

    addRow: (columns) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newGroup: FieldGroup = { id, kind: 'field_group', label: '', columns, items: [] }

        set({
            itemIds: [...itemIds, id],
            itemsData: { ...itemsData, [id]: newGroup },
            lockedGroupId: id,
            selectedItemId: id,
        })
    },

    removeCanvasItem: (itemId) => {
        const { formId, itemIds, itemsData, selectedItemId, lockedGroupId } = get()
        if (!formId) return

        if (itemsData[itemId]) {
            const newItemIds = itemIds.filter((id) => id !== itemId)
            const newItemsData = { ...itemsData }
            delete newItemsData[itemId]

            set({
                itemIds: newItemIds,
                itemsData: newItemsData,
                selectedItemId: selectedItemId === itemId ? null : selectedItemId,
                lockedGroupId: lockedGroupId === itemId ? null : lockedGroupId,
            })
            return
        }

        const newItemsData = { ...itemsData }
        for (const parentId of Object.keys(newItemsData)) {
            const parent = newItemsData[parentId]
            if (parent.kind === 'field_group') {
                const filtered = removeFieldFromGroupItems(parent.items, itemId)
                if (filtered !== parent.items) {
                    newItemsData[parentId] = { ...parent, items: filtered }
                    break
                }
            }
        }

        set({
            itemsData: newItemsData,
            selectedItemId: selectedItemId === itemId ? null : selectedItemId,
            lockedGroupId: lockedGroupId === itemId ? null : lockedGroupId,
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

    moveCanvasItem: (sourceId, targetId, edge) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return
        if (isDescendantOrSelf(itemsData, sourceId, targetId)) return

        const { removedItem, newItemIds, newItemsData } = removeItemFromTree(itemIds, itemsData, sourceId)
        if (!removedItem) return

        const position = (edge === 'top' || edge === 'left') ? 'before' : 'after'
        const result = insertItemIntoTree(newItemIds, newItemsData, targetId, removedItem, position)

        set({
            itemIds: result.newItemIds,
            itemsData: result.newItemsData,
        })
    },
})