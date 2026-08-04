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
        if (parent.kind === 'field_group') {
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
        if (item.kind === 'field_group') {
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
        if (parent.kind === 'field_group') {
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
        if (item.kind === 'field_group') {
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