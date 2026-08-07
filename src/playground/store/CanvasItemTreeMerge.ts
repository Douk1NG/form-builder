import type { CanvasField, FieldGroup, CanvasItem } from '../../types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export function replaceItemInGroupItems(
    items: Array<CanvasField | FieldGroup>,
    targetId: string,
    newItem: CanvasField | FieldGroup
): Array<CanvasField | FieldGroup> {
    let changed = false
    const mapped = items.map((item) => {
        if (item.id === targetId) {
            changed = true
            return newItem
        }
        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const updatedSubItems = replaceItemInGroupItems(item.items, targetId, newItem)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })
    return changed ? mapped : items
}

export function insertItemIntoTree(
    itemIds: string[],
    itemsData: Record<string, CanvasItem>,
    targetId: string,
    itemToInsert: CanvasItem,
    position: 'before' | 'after'
): {
    newItemIds: string[]
    newItemsData: Record<string, CanvasItem>
} {
    const newItemsData = { ...itemsData }
    const index = itemIds.indexOf(targetId)

    if (index !== -1) {
        const newItemIds = [...itemIds]
        const insertIndex = position === 'before' ? index : index + 1
        newItemIds.splice(insertIndex, 0, itemToInsert.id)
        newItemsData[itemToInsert.id] = itemToInsert
        return { newItemIds, newItemsData }
    }

    const newItemIds = [...itemIds]
    for (const parentId of Object.keys(newItemsData)) {
        const parent = newItemsData[parentId]
        if (parent.kind === ITEM_KINDS.FIELD_GROUP) {
            const newItems = insertItemIntoGroupItems(parent.items, targetId, itemToInsert, position)
            if (newItems !== parent.items) {
                newItemsData[parentId] = { ...parent, items: newItems }
                break
            }
        }
    }

    return { newItemIds, newItemsData }
}

function insertItemIntoGroupItems(
    items: Array<CanvasField | FieldGroup>,
    targetId: string,
    itemToInsert: CanvasField | FieldGroup,
    position: 'before' | 'after'
): Array<CanvasField | FieldGroup> {
    let changed = false
    const index = items.findIndex((item) => item.id === targetId)

    if (index !== -1) {
        const newItems = [...items]
        const insertIndex = position === 'before' ? index : index + 1
        newItems.splice(insertIndex, 0, itemToInsert)
        return newItems
    }

    const mapped = items.map((item) => {
        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const updatedSubItems = insertItemIntoGroupItems(item.items, targetId, itemToInsert, position)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })

    return changed ? mapped : items
}

export function mergeItemsIntoGroupInTree(
    itemIds: string[],
    itemsData: Record<string, CanvasItem>,
    sourceId: string,
    targetId: string,
    newGroup: FieldGroup
): {
    newItemIds: string[]
    newItemsData: Record<string, CanvasItem>
} {
    const newItemsData = { ...itemsData }

    // Check if both items are top-level
    const sourceIsTopLevel = itemIds.includes(sourceId)
    const targetIsTopLevel = itemIds.includes(targetId)

    if (sourceIsTopLevel && targetIsTopLevel) {
        const finalItemIds: string[] = []
        for (const id of itemIds) {
            if (id === targetId) {
                finalItemIds.push(newGroup.id)
            } else if (id !== sourceId) {
                finalItemIds.push(id)
            }
        }
        delete newItemsData[sourceId]
        delete newItemsData[targetId]
        newItemsData[newGroup.id] = newGroup
        return { newItemIds: finalItemIds, newItemsData }
    }

    // Both items are nested inside a group — find and replace them
    const newItemIds = [...itemIds]
    for (const parentId of Object.keys(newItemsData)) {
        const parent = newItemsData[parentId]
        if (parent.kind === ITEM_KINDS.FIELD_GROUP) {
            const updatedItems = mergeItemsInGroupItems(parent.items, sourceId, targetId, newGroup)
            if (updatedItems !== parent.items) {
                newItemsData[parentId] = { ...parent, items: updatedItems }
                return { newItemIds, newItemsData }
            }
        }
    }

    return { newItemIds, newItemsData }
}

function mergeItemsInGroupItems(
    items: Array<CanvasField | FieldGroup>,
    sourceId: string,
    targetId: string,
    newGroup: FieldGroup
): Array<CanvasField | FieldGroup> {
    const sourceIndex = items.findIndex((item) => item.id === sourceId)
    const targetIndex = items.findIndex((item) => item.id === targetId)

    if (sourceIndex !== -1 && targetIndex !== -1) {
        // Both are direct children of this group — replace target with newGroup, remove source
        const result: Array<CanvasField | FieldGroup> = []
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            if (itemIndex === targetIndex) {
                result.push(newGroup)
            } else if (itemIndex !== sourceIndex) {
                result.push(items[itemIndex])
            }
        }
        return result
    }

    // Recurse into nested groups
    let changed = false
    const mapped = items.map((item) => {
        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const updatedSubItems = mergeItemsInGroupItems(item.items, sourceId, targetId, newGroup)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })

    return changed ? mapped : items
}
