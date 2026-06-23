import type { Field, CanvasField, FieldGroup } from '../../types/form'

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
    return items
        .filter((groupItem) => groupItem.id !== fieldId)
        .map((groupItem) =>
            groupItem.kind === 'field_group'
                ? { ...groupItem, items: removeFieldFromGroupItems(groupItem.items, fieldId) }
                : groupItem
        )
}