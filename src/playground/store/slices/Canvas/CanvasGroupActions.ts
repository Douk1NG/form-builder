import type { StateCreator } from 'zustand'
import type { Field, CanvasItem, CanvasField, FieldGroup } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'
import {
    updateFieldInGroupItems,
    removeFieldFromGroupItems,
    addItemToGroupItems,
    updateGroupInGroupItems,
    removeItemFromTree,
    mergeItemsIntoGroupInTree
} from '@/playground/store/CanvasItemTree'
import { findItemById, isDescendantOrSelf } from '@/playground/utils/findItemById'

export type CanvasGroupActions = {
    updateField: (fieldId: string, updates: Partial<Field>) => void
    updateGroup: (groupId: string, updates: Partial<Pick<FieldGroup, 'label' | 'columns'>>) => void
    addFieldToGroup: (groupId: string, field: Omit<Field, 'id'>) => void
    addGroupToGroup: (groupId: string, label: string) => void
    addRowToGroup: (groupId: string) => void
    removeFieldFromGroup: (groupId: string, fieldId: string) => void
    createGroupFromDrop: (sourceId: string, targetId: string, side: 'left' | 'right') => void
    createGroupWithNewField: (targetId: string, field: Omit<Field, 'id'>, side: 'left' | 'right') => void
    moveFieldToGroup: (fieldId: string, groupId: string) => void
    mergeGroupIntoGroup: (sourceGroupId: string, targetGroupId: string) => void
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

        const updatedItemsData = { ...itemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, ...updates }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const newItems = updateGroupInGroupItems(item.items, groupId, updates)
                    if (newItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: newItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({ itemsData: updatedItemsData })
        }
    },

    addFieldToGroup: (groupId, field) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newField: CanvasField = { ...(field as Field), id, kind: 'field' }

        const updatedItemsData = { ...itemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, items: [...existingItem.items, newField] }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const newItems = addItemToGroupItems(item.items, groupId, newField)
                    if (newItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: newItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({ itemsData: updatedItemsData })
        }
    },

    addGroupToGroup: (groupId, label) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newGroup: FieldGroup = { id, kind: 'field_group', label, items: [] }

        const updatedItemsData = { ...itemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, items: [...existingItem.items, newGroup] }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const newItems = addItemToGroupItems(item.items, groupId, newGroup)
                    if (newItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: newItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({
                itemsData: updatedItemsData,
                lockedGroupId: id,
                selectedItemId: id,
            })
        }
    },

    addRowToGroup: (groupId) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const rowId = crypto.randomUUID()
        const newRow: FieldGroup = {
            id: rowId,
            kind: 'field_group',
            columns: 2,
            items: [],
        }

        const updatedItemsData = { ...itemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, items: [...existingItem.items, newRow] }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const newItems = addItemToGroupItems(item.items, groupId, newRow)
                    if (newItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: newItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({ itemsData: updatedItemsData })
        }
    },

    removeFieldFromGroup: (groupId, fieldId) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const updatedItemsData = { ...itemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, items: removeFieldFromGroupItems(existingItem.items, fieldId) }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const updatedSubItems = removeFieldFromGroupItems(item.items, fieldId)
                    if (updatedSubItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: updatedSubItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({ itemsData: updatedItemsData })
        }
    },

    createGroupFromDrop: (sourceId, targetId, side) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const sourceItem = findItemById(itemsData, sourceId)
        const targetItem = findItemById(itemsData, targetId)

        if (!sourceItem || !targetItem) return
        if (sourceItem.kind !== 'field' || targetItem.kind !== 'field') return

        const leftItem = side === 'left' ? sourceItem : targetItem
        const rightItem = side === 'right' ? sourceItem : targetItem

        const groupId = crypto.randomUUID()
        const newGroup: FieldGroup = {
            id: groupId,
            kind: 'field_group',
            label: '',
            columns: 2,
            items: [leftItem as CanvasField, rightItem as CanvasField],
        }

        const { newItemIds, newItemsData } = mergeItemsIntoGroupInTree(
            itemIds, itemsData, sourceId, targetId, newGroup
        )

        set({
            itemIds: newItemIds,
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
            label: '',
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
        if (isDescendantOrSelf(itemsData, fieldId, groupId)) return

        const { removedItem, newItemIds, newItemsData } = removeItemFromTree(itemIds, itemsData, fieldId)
        if (!removedItem) return

        const updatedItemsData = { ...newItemsData }
        let found = false

        const existingItem = updatedItemsData[groupId]
        if (existingItem && existingItem.kind === 'field_group') {
            updatedItemsData[groupId] = { ...existingItem, items: [...existingItem.items, removedItem as CanvasField | FieldGroup] }
            found = true
        } else {
            for (const itemId of Object.keys(updatedItemsData)) {
                const item = updatedItemsData[itemId]
                if (item.kind === 'field_group') {
                    const newItems = addItemToGroupItems(item.items, groupId, removedItem as CanvasField | FieldGroup)
                    if (newItems !== item.items) {
                        updatedItemsData[itemId] = { ...item, items: newItems }
                        found = true
                        break
                    }
                }
            }
        }

        if (found) {
            set({
                itemIds: newItemIds,
                itemsData: updatedItemsData,
            })
        }
    },

    mergeGroupIntoGroup: (sourceGroupId, targetGroupId) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const sourceGroup = itemsData[sourceGroupId]
        const targetGroup = itemsData[targetGroupId]

        if (!sourceGroup || !targetGroup) return
        if (sourceGroup.kind !== 'field_group' || targetGroup.kind !== 'field_group') return
        if (sourceGroupId === targetGroupId) return
        if (isDescendantOrSelf(itemsData, sourceGroupId, targetGroupId)) return
        if (isDescendantOrSelf(itemsData, targetGroupId, sourceGroupId)) return

        const mergedItems = [...targetGroup.items, ...sourceGroup.items]

        const newItemIds = itemIds.filter((id) => id !== sourceGroupId)
        const newItemsData = { ...itemsData }
        delete newItemsData[sourceGroupId]
        newItemsData[targetGroupId] = { ...targetGroup, items: mergedItems }

        set({
            itemIds: newItemIds,
            itemsData: newItemsData,
        })
    },
})