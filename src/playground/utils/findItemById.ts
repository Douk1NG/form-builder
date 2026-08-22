import type { CanvasItem } from '../../types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export function findItemInItems(items: Array<CanvasItem>, itemId: string): CanvasItem | null {
    for (const item of items) {
        if (item.id === itemId) return item

        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const nestedMatch = findItemInItems(item.items, itemId)
            if (nestedMatch) return nestedMatch
        }
    }
    return null
}

export function findItemById(items: Record<string, CanvasItem>, itemId: string): CanvasItem | null {
    const direct = items[itemId]
    if (direct) return direct

    for (const item of Object.values(items)) {
        if (item.kind === ITEM_KINDS.FIELD_GROUP) {
            const nestedMatch = findItemInItems(item.items, itemId)
            if (nestedMatch) return nestedMatch
        }
    }

    return null
}

function isItemInGroupItems(groupItems: Array<CanvasItem>, itemId: string): boolean {
    for (const item of groupItems) {
        if (item.id === itemId) {
            return true
        }
        if (item.kind === ITEM_KINDS.FIELD_GROUP && isItemInGroupItems(item.items, itemId)) {
            return true
        }
    }
    return false
}

export function isDescendantOrSelf(
    items: Record<string, CanvasItem>,
    parentId: string,
    childId: string
): boolean {
    if (parentId === childId) {
        return true
    }

    const parentItem = items[parentId] || findItemById(items, parentId)
    if (parentItem && parentItem.kind === ITEM_KINDS.FIELD_GROUP) {
        return isItemInGroupItems(parentItem.items, childId)
    }

    return false
}