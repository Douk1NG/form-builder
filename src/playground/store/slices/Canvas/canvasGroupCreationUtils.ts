import type { CanvasItem, CanvasField, FieldGroup, NewFieldInput, Field } from '@/types/form'
import { generateUuid } from '@/lib/utils'
import { findItemById } from '@/playground/utils/findItemById'
import { mergeItemsIntoGroupInTree, replaceItemInGroupItems } from '@/playground/store/CanvasItemTreeMerge'
import { DEFAULT_TWO_COLUMN_COUNT } from '@/playground/constants/fieldDefaults'
import { ITEM_KINDS } from '@/types/itemKinds'

function createTwoColumnGroup(leftItem: CanvasField, rightItem: CanvasField): FieldGroup {
    return {
        id: generateUuid(),
        kind: ITEM_KINDS.FIELD_GROUP,
        label: '',
        columns: DEFAULT_TWO_COLUMN_COUNT,
        items: [leftItem, rightItem],
    }
}

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
    if (sourceItem.kind !== ITEM_KINDS.FIELD || targetItem.kind !== ITEM_KINDS.FIELD) return null

    const leftItem = side === 'left' ? sourceItem : targetItem
    const rightItem = side === 'right' ? sourceItem : targetItem

    const newGroup = createTwoColumnGroup(leftItem as CanvasField, rightItem as CanvasField)
    const groupId = newGroup.id

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
    if (!targetItem || targetItem.kind !== ITEM_KINDS.FIELD) return null

    const newFieldId = generateUuid()
    const newField: CanvasField = { ...(field as Field), id: newFieldId, kind: ITEM_KINDS.FIELD }

    const leftItem = side === 'left' ? newField : targetItem
    const rightItem = side === 'right' ? newField : targetItem

    const newGroup = createTwoColumnGroup(leftItem as CanvasField, rightItem as CanvasField)
    const groupId = newGroup.id

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
        if (parent.kind === ITEM_KINDS.FIELD_GROUP) {
            const replacedItems = replaceItemInGroupItems(parent.items, targetId, newGroup)
            if (replacedItems !== parent.items) {
                newItemsData[parentId] = { ...parent, items: replacedItems }
                break
            }
        }
    }
    return newItemsData
}
