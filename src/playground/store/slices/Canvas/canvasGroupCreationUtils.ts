import type { CanvasItem, CanvasField, FieldGroup, NewFieldInput, Field } from '@/types/form'
import { findItemById } from '@/playground/utils/findItemById'
import { mergeItemsIntoGroupInTree, replaceItemInGroupItems } from '@/playground/store/CanvasItemTreeMerge'
import { DEFAULT_TWO_COLUMN_COUNT } from '@/playground/constants/fieldDefaults'

export function handleCreateGroupFromDrop(
    itemIds: string[],
    itemsData: Record<string, CanvasItem>,
    sourceId: string,
    targetId: string,
    side: 'left' | 'right'
): { newItemIds: string[], newItemsData: Record<string, CanvasItem>, groupId: string } | null {
    const sourceItem = findItemById(itemsData, sourceId)
    const targetItem = findItemById(itemsData, targetId)

    if (!sourceItem || !targetItem) return null
    if (sourceItem.kind !== 'field' || targetItem.kind !== 'field') return null

    const leftItem = side === 'left' ? sourceItem : targetItem
    const rightItem = side === 'right' ? sourceItem : targetItem

    const groupId = crypto.randomUUID()
    const newGroup: FieldGroup = {
        id: groupId,
        kind: 'field_group',
        label: '',
        columns: DEFAULT_TWO_COLUMN_COUNT,
        items: [leftItem as CanvasField, rightItem as CanvasField],
    }

    const { newItemIds, newItemsData } = mergeItemsIntoGroupInTree(
        itemIds, itemsData, sourceId, targetId, newGroup
    )

    return { newItemIds, newItemsData, groupId }
}

export function handleCreateGroupWithNewField(
    itemIds: string[],
    itemsData: Record<string, CanvasItem>,
    targetId: string,
    field: NewFieldInput,
    side: 'left' | 'right'
): { newItemIds: string[], newItemsData: Record<string, CanvasItem>, groupId: string } | null {
    const targetItem = findItemById(itemsData, targetId)
    if (!targetItem || targetItem.kind !== 'field') return null

    const newFieldId = crypto.randomUUID()
    const newField: CanvasField = { ...(field as Field), id: newFieldId, kind: 'field' }

    const leftItem = side === 'left' ? newField : targetItem
    const rightItem = side === 'right' ? newField : targetItem

    const groupId = crypto.randomUUID()
    const newGroup: FieldGroup = {
        id: groupId,
        kind: 'field_group',
        label: '',
        columns: DEFAULT_TWO_COLUMN_COUNT,
        items: [leftItem as CanvasField, rightItem as CanvasField],
    }

    const isTopLevel = itemIds.includes(targetId)
    if (isTopLevel) {
        const finalItemIds = itemIds.map((id) => id === targetId ? groupId : id)
        const newItemsData = { ...itemsData }
        delete newItemsData[targetId]
        newItemsData[groupId] = newGroup

        return { newItemIds: finalItemIds, newItemsData, groupId }
    }

    const newItemsData = replaceItemInNestedGroups(itemsData, targetId, newGroup)
    return { newItemIds: itemIds, newItemsData, groupId }
}

function replaceItemInNestedGroups(
    itemsData: Record<string, CanvasItem>,
    targetId: string,
    newGroup: FieldGroup
): Record<string, CanvasItem> {
    const newItemsData = { ...itemsData }
    for (const parentId of Object.keys(newItemsData)) {
        const parent = newItemsData[parentId]
        if (parent.kind === 'field_group') {
            const replacedItems = replaceItemInGroupItems(parent.items, targetId, newGroup)
            if (replacedItems !== parent.items) {
                newItemsData[parentId] = { ...parent, items: replacedItems }
                break
            }
        }
    }
    return newItemsData
}
