import type { StateCreator } from 'zustand'
import type { Field, CanvasItem, CanvasField, FieldGroup, NewFieldInput } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'
import {
    updateFieldInGroupItems,
    removeFieldFromGroupItems,
    addItemToGroupItems,
    updateGroupInGroupItems,
    removeItemFromTree,
    findAndUpdateInTree
} from '@/playground/store/CanvasItemTree'
import { isDescendantOrSelf } from '@/playground/utils/findItemById'
import { handleCreateGroupFromDrop, handleCreateGroupWithNewField } from './canvasGroupCreationUtils'
import { DEFAULT_TWO_COLUMN_COUNT } from '@/playground/constants/fieldDefaults'

export type CanvasGroupActions = {
    updateField: (fieldId: string, updates: Partial<Field>) => void
    updateGroup: (groupId: string, updates: Partial<Pick<FieldGroup, 'label' | 'columns'>>) => void
    addFieldToGroup: (groupId: string, field: NewFieldInput) => void
    addGroupToGroup: (groupId: string, label: string) => void
    addRowToGroup: (groupId: string) => void
    removeFieldFromGroup: (groupId: string, fieldId: string) => void
    createGroupFromDrop: (sourceId: string, targetId: string, side: 'left' | 'right') => void
    createGroupWithNewField: (targetId: string, field: NewFieldInput, side: 'left' | 'right') => void
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
                const updatedGroupItems = updateFieldInGroupItems(item.items, fieldId, updates)
                if (updatedGroupItems !== item.items) {
                    updatedItemsData[itemId] = {
                        ...item,
                        items: updatedGroupItems,
                    }
                    break
                }
            }
        }

        set({ itemsData: updatedItemsData })
    },

    updateGroup: (groupId, updates) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            (group) => ({ ...group, ...updates }),
            (items, id) => updateGroupInGroupItems(items, id, updates)
        )

        if (found) {
            set({ itemsData: newItemsData })
        }
    },

    addFieldToGroup: (groupId, field) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newField: CanvasField = { ...(field as Field), id, kind: 'field' }

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            (group) => ({ ...group, items: [...group.items, newField] }),
            (items, id) => addItemToGroupItems(items, id, newField)
        )

        if (found) {
            set({ itemsData: newItemsData })
        }
    },

    addGroupToGroup: (groupId, label) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const id = crypto.randomUUID()
        const newGroup: FieldGroup = { id, kind: 'field_group', label, items: [] }

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            (group) => ({ ...group, items: [...group.items, newGroup] }),
            (items, id) => addItemToGroupItems(items, id, newGroup)
        )

        if (found) {
            set({
                itemsData: newItemsData,
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
            columns: DEFAULT_TWO_COLUMN_COUNT,
            items: [],
        }

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            (group) => ({ ...group, items: [...group.items, newRow] }),
            (items, id) => addItemToGroupItems(items, id, newRow)
        )

        if (found) {
            set({ itemsData: newItemsData })
        }
    },

    removeFieldFromGroup: (groupId, fieldId) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            (group) => ({ ...group, items: removeFieldFromGroupItems(group.items, fieldId) }),
            (items) => removeFieldFromGroupItems(items, fieldId)
        )

        if (found) {
            set({ itemsData: newItemsData })
        }
    },

    createGroupFromDrop: (sourceId, targetId, side) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const result = handleCreateGroupFromDrop(itemIds, itemsData, sourceId, targetId, side)
        if (result) {
            set({
                itemIds: result.newItemIds,
                itemsData: result.newItemsData,
                selectedItemId: result.groupId,
            })
        }
    },

    createGroupWithNewField: (targetId, field, side) => {
        const { formId, itemIds, itemsData } = get()
        if (!formId) return

        const result = handleCreateGroupWithNewField(itemIds, itemsData, targetId, field, side)
        if (result) {
            set({
                itemIds: result.newItemIds,
                itemsData: result.newItemsData,
                selectedItemId: result.groupId,
            })
        }
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
            const result = tryAddNestedGroupItem(updatedItemsData, groupId, removedItem as CanvasField | FieldGroup)
            if (result) {
                Object.assign(updatedItemsData, result)
                found = true
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

function tryAddNestedGroupItem(
    itemsData: Record<string, CanvasItem>,
    groupId: string,
    itemToInsert: CanvasField | FieldGroup
): Record<string, CanvasItem> | null {
    const newItemsData = { ...itemsData }
    for (const itemId of Object.keys(newItemsData)) {
        const item = newItemsData[itemId]
        if (item.kind === 'field_group') {
            const newItems = addItemToGroupItems(item.items, groupId, itemToInsert)
            if (newItems !== item.items) {
                newItemsData[itemId] = { ...item, items: newItems }
                return newItemsData
            }
        }
    }
    return null
}