import type { StateCreator } from 'zustand'
import type { Field, CanvasItem, CanvasField, FieldGroup } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'
import { updateFieldInGroupItems, removeFieldFromGroupItems } from '@/playground/store/CanvasItemTree'

export type CanvasGroupActions = {
    updateField: (fieldId: string, updates: Partial<Field>) => void
    updateGroup: (groupId: string, updates: Partial<Pick<FieldGroup, 'label' | 'columns'>>) => void
    addFieldToGroup: (groupId: string, field: Omit<Field, 'id'>) => void
    removeFieldFromGroup: (groupId: string, fieldId: string) => void
    createGroupFromDrop: (sourceId: string, targetId: string, side: 'left' | 'right') => void
    createGroupWithNewField: (targetId: string, field: Omit<Field, 'id'>, side: 'left' | 'right') => void
    moveFieldToGroup: (fieldId: string, groupId: string) => void
}

export const createCanvasGroupActions: StateCreator<FormBuilderState, [], [], CanvasGroupActions> = (set, get) => ({
    updateField: (fieldId, updates) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const updatedItemsData = { ...itemsData }

        for (const itemId of Object.keys(updatedItemsData)) {
            const item = updatedItemsData[itemId]

            if (item.kind === 'field' && item.id === fieldId) {
                updatedItemsData[itemId] = { ...item, ...updates } as CanvasItem
                break
            }

            if (item.kind === 'field_group') {
                updatedItemsData[itemId] = {
                    ...item,
                    items: updateFieldInGroupItems(item.items, fieldId, updates),
                }
            }
        }

        set({ itemsData: updatedItemsData })
    },

    updateGroup: (groupId, updates) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const existingItem = itemsData[groupId]
        if (!existingItem || existingItem.kind !== 'field_group') return

        set({
            itemsData: {
                ...itemsData,
                [groupId]: { ...existingItem, ...updates },
            },
        })
    },

    addFieldToGroup: (groupId, field) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const existingItem = itemsData[groupId]
        if (!existingItem || existingItem.kind !== 'field_group') return

        const id = crypto.randomUUID()
        const newField: CanvasField = { ...(field as Field), id, kind: 'field' }

        set({
            itemsData: {
                ...itemsData,
                [groupId]: { ...existingItem, items: [...existingItem.items, newField] },
            },
        })
    },

    removeFieldFromGroup: (groupId, fieldId) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const existingItem = itemsData[groupId]
        if (!existingItem || existingItem.kind !== 'field_group') return

        set({
            itemsData: {
                ...itemsData,
                [groupId]: { ...existingItem, items: removeFieldFromGroupItems(existingItem.items, fieldId) },
            },
        })
    },

    createGroupFromDrop: (sourceId, targetId, side) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const sourceItem = itemsData[sourceId]
        const targetItem = itemsData[targetId]

        if (!sourceItem || !targetItem) return
        if (sourceItem.kind !== 'field' || targetItem.kind !== 'field') return

        const leftItem = side === 'left' ? sourceItem : targetItem
        const rightItem = side === 'right' ? sourceItem : targetItem

        const groupId = crypto.randomUUID()
        const newGroup: FieldGroup = {
            id: groupId,
            kind: 'field_group',
            columns: 2,
            items: [leftItem as CanvasField, rightItem as CanvasField],
        }

        const finalItemIds: string[] = []
        for (const id of itemIds) {
            if (id === targetId) {
                finalItemIds.push(groupId)
            } else if (id !== sourceId) {
                finalItemIds.push(id)
            }
        }

        const newItemsData = { ...itemsData }
        delete newItemsData[sourceId]
        delete newItemsData[targetId]
        newItemsData[groupId] = newGroup

        set({
            itemIds: finalItemIds,
            itemsData: newItemsData,
            selectedItemId: groupId,
        })
    },

    createGroupWithNewField: (targetId, field, side) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const targetItem = itemsData[targetId]
        if (!targetItem || targetItem.kind !== 'field') return

        const newFieldId = crypto.randomUUID()
        const newField: CanvasField = { ...(field as Field), id: newFieldId, kind: 'field' }

        const leftItem = side === 'left' ? newField : targetItem
        const rightItem = side === 'right' ? newField : targetItem

        const groupId = crypto.randomUUID()
        const newGroup: FieldGroup = {
            id: groupId,
            kind: 'field_group',
            columns: 2,
            items: [leftItem as CanvasField, rightItem as CanvasField],
        }

        const finalItemIds: string[] = []
        for (const id of itemIds) {
            if (id === targetId) {
                finalItemIds.push(groupId)
            } else {
                finalItemIds.push(id)
            }
        }

        const newItemsData = { ...itemsData }
        delete newItemsData[targetId]
        newItemsData[groupId] = newGroup

        set({
            itemIds: finalItemIds,
            itemsData: newItemsData,
            selectedItemId: groupId,
        })
    },

    moveFieldToGroup: (fieldId, groupId) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const fieldItem = itemsData[fieldId]
        const groupItem = itemsData[groupId]

        if (!fieldItem || !groupItem || groupItem.kind !== 'field_group') return

        const newItemIds = itemIds.filter((id) => id !== fieldId)
        const updatedGroupItems = [...groupItem.items, fieldItem as CanvasField | FieldGroup]

        set({
            itemIds: newItemIds,
            itemsData: {
                ...itemsData,
                [groupId]: { ...groupItem, items: updatedGroupItems },
            },
        })
    },
})