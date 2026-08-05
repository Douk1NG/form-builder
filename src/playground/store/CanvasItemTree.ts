import type { Field, CanvasField, FieldGroup, CanvasItem } from '../../types/form'

export function applyFieldUpdates<T extends Field>(field: T, fieldId: string, updates: Partial<Field>): T {
    if (field.id === fieldId) {
        return { ...field, ...updates } as T
    }
    return field
}

export function updateFieldInGroupItems(
    items: Array<CanvasField | FieldGroup>,
    fieldId: string,
    updates: Partial<Field>
): Array<CanvasField | FieldGroup> {
    return items.map((groupItem) => {
        if (groupItem.kind === 'field_group') {
            return { ...groupItem, items: updateFieldInGroupItems(groupItem.items, fieldId, updates) }
        }
        return applyFieldUpdates(groupItem as CanvasField, fieldId, updates)
    })
}

export function removeFieldFromGroupItems(
    items: Array<CanvasField | FieldGroup>,
    fieldId: string
): Array<CanvasField | FieldGroup> {
    let changed = false
    const filtered = items.filter((item) => {
        if (item.id === fieldId) {
            changed = true
            return false
        }
        return true
    })

    const mapped = filtered.map((item) => {
        if (item.kind === 'field_group') {
            const updatedSubItems = removeFieldFromGroupItems(item.items, fieldId)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })

    return changed ? mapped : items
}

export function addItemToGroupItems(
    items: Array<CanvasField | FieldGroup>,
    groupId: string,
    itemToAdd: CanvasField | FieldGroup
): Array<CanvasField | FieldGroup> {
    let changed = false
    const newItems = items.map((item) => {
        if (item.id === groupId && item.kind === 'field_group') {
            changed = true
            return { ...item, items: [...item.items, itemToAdd] }
        }
        if (item.kind === 'field_group') {
            const updatedSubItems = addItemToGroupItems(item.items, groupId, itemToAdd)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })
    return changed ? newItems : items
}

export function updateGroupInGroupItems(
    items: Array<CanvasField | FieldGroup>,
    groupId: string,
    updates: Partial<Pick<FieldGroup, 'label' | 'columns'>>
): Array<CanvasField | FieldGroup> {
    let changed = false
    const newItems = items.map((item) => {
        if (item.id === groupId && item.kind === 'field_group') {
            changed = true
            return { ...item, ...updates }
        }
        if (item.kind === 'field_group') {
            const updatedSubItems = updateGroupInGroupItems(item.items, groupId, updates)
            if (updatedSubItems !== item.items) {
                changed = true
                return { ...item, items: updatedSubItems }
            }
        }
        return item
    })
    return changed ? newItems : items
}

export function removeItemFromTree(
    itemIds: string[],
    itemsData: Record<string, CanvasItem>,
    sourceId: string
): {
    removedItem: CanvasItem | null
    newItemIds: string[]
    newItemsData: Record<string, CanvasItem>
} {
    let removedItem: CanvasItem | null = null
    const newItemsData = { ...itemsData }

    if (newItemsData[sourceId]) {
        removedItem = newItemsData[sourceId]
        const newItemIds = itemIds.filter((id) => id !== sourceId)
        delete newItemsData[sourceId]
        return { removedItem, newItemIds, newItemsData }
    }

    const newItemIds = [...itemIds]
    for (const parentId of Object.keys(newItemsData)) {
        const parent = newItemsData[parentId]
        if (parent.kind === 'field_group') {
            const result = removeItemFromGroupItems(parent.items, sourceId)
            if (result.removedItem) {
                removedItem = result.removedItem
                newItemsData[parentId] = { ...parent, items: result.newItems }
                break
            }
        }
    }

    return { removedItem, newItemIds, newItemsData }
}

function removeItemFromGroupItems(
    items: Array<CanvasField | FieldGroup>,
    sourceId: string
): {
    removedItem: CanvasItem | null
    newItems: Array<CanvasField | FieldGroup>
} {
    let removedItem: CanvasItem | null = null
    const filtered = items.filter((item) => {
        if (item.id === sourceId) {
            removedItem = item
            return false
        }
        return true
    })

    if (removedItem) {
        return { removedItem, newItems: filtered }
    }

    const mapped = items.map((item) => {
        if (item.kind === 'field_group') {
            const result = removeItemFromGroupItems(item.items, sourceId)
            if (result.removedItem) {
                removedItem = result.removedItem
                return { ...item, items: result.newItems }
            }
        }
        return item
    })

    return { removedItem, newItems: mapped }
}

export function findAndUpdateInTree(
    itemsData: Record<string, CanvasItem>,
    targetGroupId: string,
    updateFn: (group: FieldGroup) => FieldGroup,
    recurseFn: (items: Array<CanvasField | FieldGroup>, targetId: string) => Array<CanvasField | FieldGroup>
): {
    newItemsData: Record<string, CanvasItem>
    found: boolean
} {
    const newItemsData = { ...itemsData }
    let found = false

    const existingItem = newItemsData[targetGroupId]
    if (existingItem && existingItem.kind === 'field_group') {
        newItemsData[targetGroupId] = updateFn(existingItem)
        found = true
    } else {
        for (const itemId of Object.keys(newItemsData)) {
            const item = newItemsData[itemId]
            if (item.kind === 'field_group') {
                const newItems = recurseFn(item.items, targetGroupId)
                if (newItems !== item.items) {
                    newItemsData[itemId] = { ...item, items: newItems }
                    found = true
                    break
                }
            }
        }
    }

    return { newItemsData, found }
}