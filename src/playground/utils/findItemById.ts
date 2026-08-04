import type { CanvasItem } from '../../types/form'

export function findItemById(items: Record<string, CanvasItem>, itemId: string): CanvasItem | null {
    for (const item of Object.values(items)) {
        if (item.id === itemId) return item

        if (item.kind === 'field_group') {
            const nestedItems = Object.fromEntries(item.items.map((child) => [child.id, child]))
            const nestedMatch = findItemById(nestedItems, itemId)
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
        if (item.kind === 'field_group' && isItemInGroupItems(item.items, itemId)) {
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
    if (parentItem && parentItem.kind === 'field_group') {
        return isItemInGroupItems(parentItem.items, childId)
    }

    return false
}