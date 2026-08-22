import type { StateCreator } from 'zustand'
import { generateUuid } from '@/lib/utils'
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
import { ITEM_KINDS } from '@/types/itemKinds'

export type CanvasGroupActions = {
    updateField: (fieldId: string, updates: Partial<Field>) => void
    updateGroup: (groupId: string, updates: Partial<Pick<FieldGroup, 'label' | 'columns'>>) => void
    addFieldToGroup: (groupId: string, field: NewFieldInput) => void
    addGroupToGroup: (groupId: string, label: string) => void
    addRowToGroup: (groupId: string) => void
    removeFieldFromGroup: (groupId: string, fieldId: string) => void
    reorderFieldInGroup: (groupId: string, fieldId: string, direction: 'up' | 'down') => void
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

            if (item.kind === ITEM_KINDS.FIELD && item.id === fieldId) {
                updatedItemsData[itemId] = { ...item, ...updates } as CanvasItem
                break
            }

            if (item.kind === ITEM_KINDS.FIELD_GROUP) {
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

        const id = generateUuid()
        const newField: CanvasField = { ...(field as Field), id, kind: ITEM_KINDS.FIELD }

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

        const id = generateUuid()
        const newGroup: FieldGroup = { id, kind: ITEM_KINDS.FIELD_GROUP, label, items: [] }

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

        const rowId = generateUuid()
        const newRow: FieldGroup = {
            id: rowId,
            kind: ITEM_KINDS.FIELD_GROUP,
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
            set({
                itemsData: newItemsData,
                lockedGroupId: rowId,
                selectedItemId: rowId,
            })
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

    reorderFieldInGroup: (groupId, fieldId, direction) => {
        const { formId, itemsData } = get()
        if (!formId) return

        const swapAdjacentItems = (group: FieldGroup): FieldGroup => {
            const fieldIndex = group.items.findIndex((item) => item.id === fieldId)
            if (fieldIndex === -1) return group

            const isAtBoundary = direction === 'up'
                ? fieldIndex === 0
                : fieldIndex === group.items.length - 1
            if (isAtBoundary) return group

            const swapIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1
            const reorderedItems = [...group.items]
            const temporaryItem = reorderedItems[fieldIndex]
            reorderedItems[fieldIndex] = reorderedItems[swapIndex]
            reorderedItems[swapIndex] = temporaryItem

            return { ...group, items: reorderedItems }
        }

        const reorderInNestedGroup = (items: (CanvasField | FieldGroup)[]): (CanvasField | FieldGroup)[] => {
            return items.map((item) => {
                if (item.kind !== ITEM_KINDS.FIELD_GROUP) return item
                if (item.id === groupId) return swapAdjacentItems(item)
                const updatedChildren = reorderInNestedGroup(item.items)
                if (updatedChildren === item.items) return item
                return { ...item, items: updatedChildren }
            })
        }

        const { newItemsData, found } = findAndUpdateInTree(
            itemsData,
            groupId,
            swapAdjacentItems,
            reorderInNestedGroup
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
        if (existingItem && existingItem.kind === ITEM_KINDS.FIELD_GROUP) {
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
        if (sourceGroup.kind !== ITEM_KINDS.FIELD_GROUP || targetGroup.kind !== ITEM_KINDS.FIELD_GROUP) return
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
        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const newItems = addItemToGroupItems(item.items, groupId, itemToInsert)
            if (newItems !== item.items) {
                newItemsData[itemId] = { ...item, items: newItems }
                return newItemsData
            }
        }
    }
    return null
}