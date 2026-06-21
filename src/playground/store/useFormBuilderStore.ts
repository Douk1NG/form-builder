import { create } from 'zustand'
import type { Field, CanvasItem, CanvasField, ColumnRow, FieldGroup } from '../../types/form'

export type FormSchema = {
  id: string
  title: string
  description?: string
  items: CanvasItem[]
}

export type FormBuilderState = {
  formId: string | null
  formTitle: string
  formDescription: string
  itemIds: string[]
  itemsData: Record<string, CanvasItem>

  selectedItemId: string | null
  previewMode: boolean

  createForm: (title: string) => void
  addField: (field: Omit<Field, 'id'>) => void
  addGroup: (label: string) => void
  addColumnRow: () => void
  updateField: (fieldId: string, updates: Partial<Field>) => void
  updateGroup: (groupId: string, updates: Partial<Pick<FieldGroup, 'label'>>) => void
  addFieldToGroup: (groupId: string, field: Omit<Field, 'id'>) => void
  addColumnRowToGroup: (groupId: string) => void
  addFieldToColumnRowSlot: (rowId: string, slot: 'leftField' | 'rightField', field: Omit<Field, 'id'>) => void
  addFieldToGroupColumnRowSlot: (groupId: string, rowId: string, slot: 'leftField' | 'rightField', field: Omit<Field, 'id'>) => void
  removeCanvasItem: (itemId: string) => void
  removeFieldFromGroup: (groupId: string, fieldId: string) => void
  removeColumnRowFromGroup: (groupId: string, rowId: string) => void
  removeFieldFromColumnRow: (rowId: string, slot: 'leftField' | 'rightField') => void
  removeFieldFromGroupColumnRow: (groupId: string, rowId: string, slot: 'leftField' | 'rightField') => void
  reorderItem: (itemId: string, direction: 'up' | 'down') => void
  setSelectedItem: (itemId: string | null) => void
  setPreviewMode: (enabled: boolean) => void
  insertItemAt: (index: number, item: CanvasItem) => void
  moveItem: (sourceIndex: number, destinationIndex: number) => void

  getFormSchema: () => FormSchema | null
}

function applyFieldUpdates<T extends Field>(field: T, fieldId: string, updates: Partial<Field>): T {
  if (field.id === fieldId) {
    return { ...field, ...updates } as T
  }
  return field
}

function updateFieldInColumnRow(row: ColumnRow, fieldId: string, updates: Partial<Field>): ColumnRow {
  return {
    ...row,
    leftField: row.leftField ? applyFieldUpdates(row.leftField, fieldId, updates) : null,
    rightField: row.rightField ? applyFieldUpdates(row.rightField, fieldId, updates) : null,
  }
}

function updateFieldInGroupItems(
  items: Array<CanvasField | ColumnRow>,
  fieldId: string,
  updates: Partial<Field>
): Array<CanvasField | ColumnRow> {
  return items.map((groupItem) => {
    if (groupItem.kind === 'column_row') {
      return updateFieldInColumnRow(groupItem, fieldId, updates)
    }
    return applyFieldUpdates(groupItem as CanvasField, fieldId, updates)
  })
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formId: null,
  formTitle: '',
  formDescription: '',
  itemIds: [],
  itemsData: {},

  selectedItemId: null,
  previewMode: false,

  createForm: (title) => {
    set({
      formId: crypto.randomUUID(),
      formTitle: title,
      formDescription: '',
      itemIds: [],
      itemsData: {},
      selectedItemId: null,
    })
  },

  addField: (field) => {
    const { formId, itemIds, itemsData } = get()
    if (!formId) return

    const id = crypto.randomUUID()
    const newItem: CanvasField = { ...(field as Field), id, kind: 'field' }

    set({
      itemIds: [...itemIds, id],
      itemsData: { ...itemsData, [id]: newItem },
    })
  },

  addGroup: (label) => {
    const { formId, itemIds, itemsData } = get()
    if (!formId) return

    const id = crypto.randomUUID()
    const newGroup: FieldGroup = { id, kind: 'field_group', label, items: [] }

    set({
      itemIds: [...itemIds, id],
      itemsData: { ...itemsData, [id]: newGroup },
    })
  },

  addColumnRow: () => {
    const { formId, itemIds, itemsData } = get()
    if (!formId) return

    const id = crypto.randomUUID()
    const newRow: ColumnRow = { id, kind: 'column_row', leftField: null, rightField: null }

    set({
      itemIds: [...itemIds, id],
      itemsData: { ...itemsData, [id]: newRow },
    })
  },

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
        updatedItemsData[itemId] = {
          ...item,
          items: updateFieldInGroupItems(item.items, fieldId, updates),
        }
      }

      if (item.kind === 'column_row') {
        updatedItemsData[itemId] = updateFieldInColumnRow(item, fieldId, updates)
      }
    }

    set({ itemsData: updatedItemsData })
  },

  updateGroup: (groupId, updates) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, ...updates },
      },
    })
  },

  addFieldToGroup: (groupId, field) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const id = crypto.randomUUID()
    const newField: CanvasField = { ...(field as Field), id, kind: 'field' }

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: [...existingItem.items, newField] },
      },
    })
  },

  addColumnRowToGroup: (groupId) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const id = crypto.randomUUID()
    const newRow: ColumnRow = { id, kind: 'column_row', leftField: null, rightField: null }

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: [...existingItem.items, newRow] },
      },
    })
  },

  addFieldToColumnRowSlot: (rowId, slot, field) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[rowId]
    if (!existingItem || existingItem.kind !== 'column_row') return

    const id = crypto.randomUUID()
    const newField: Field = { ...(field as Field), id }

    set({
      itemsData: {
        ...itemsData,
        [rowId]: { ...existingItem, [slot]: newField },
      },
    })
  },

  addFieldToGroupColumnRowSlot: (groupId, rowId, slot, field) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const id = crypto.randomUUID()
    const newField: Field = { ...(field as Field), id }

    const updatedItems = existingItem.items.map((groupItem) => {
      if (groupItem.kind === 'column_row' && groupItem.id === rowId) {
        return { ...groupItem, [slot]: newField }
      }
      return groupItem
    })

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: updatedItems },
      },
    })
  },

  removeCanvasItem: (itemId) => {
    const { formId, itemIds, itemsData, selectedItemId } = get()
    if (!formId) return

    const newItemIds = itemIds.filter((id) => id !== itemId)
    const newItemsData = { ...itemsData }
    delete newItemsData[itemId]

    set({
      itemIds: newItemIds,
      itemsData: newItemsData,
      selectedItemId: selectedItemId === itemId ? null : selectedItemId,
    })
  },

  removeFieldFromGroup: (groupId, fieldId) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const updatedItems = existingItem.items.filter(
      (groupItem) => !(groupItem.kind !== 'column_row' && (groupItem as Field).id === fieldId)
    )

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: updatedItems },
      },
    })
  },

  removeColumnRowFromGroup: (groupId, rowId) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const updatedItems = existingItem.items.filter(
      (groupItem) => !(groupItem.kind === 'column_row' && groupItem.id === rowId)
    )

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: updatedItems },
      },
    })
  },

  removeFieldFromColumnRow: (rowId, slot) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[rowId]
    if (!existingItem || existingItem.kind !== 'column_row') return

    set({
      itemsData: {
        ...itemsData,
        [rowId]: { ...existingItem, [slot]: null },
      },
    })
  },

  removeFieldFromGroupColumnRow: (groupId, rowId, slot) => {
    const { formId, itemsData } = get()
    if (!formId) return

    const existingItem = itemsData[groupId]
    if (!existingItem || existingItem.kind !== 'field_group') return

    const updatedItems = existingItem.items.map((groupItem) => {
      if (groupItem.kind === 'column_row' && groupItem.id === rowId) {
        return { ...groupItem, [slot]: null }
      }
      return groupItem
    })

    set({
      itemsData: {
        ...itemsData,
        [groupId]: { ...existingItem, items: updatedItems },
      },
    })
  },

  reorderItem: (itemId, direction) => {
    const { formId, itemIds } = get()
    if (!formId) return

    const index = itemIds.indexOf(itemId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === itemIds.length - 1) return

    const newItemIds = [...itemIds]
    const swapIndex = direction === 'up' ? index - 1 : index + 1

    const temporary = newItemIds[index]
    newItemIds[index] = newItemIds[swapIndex]
    newItemIds[swapIndex] = temporary

    set({ itemIds: newItemIds })
  },

  setSelectedItem: (itemId) => {
    set({ selectedItemId: itemId })
  },

  setPreviewMode: (enabled) => {
    set({ previewMode: enabled })
  },

  insertItemAt: (index, item) => {
    const { formId, itemIds, itemsData } = get()
    if (!formId) return

    const newItemIds = [...itemIds]
    newItemIds.splice(index, 0, item.id)

    set({
      itemIds: newItemIds,
      itemsData: { ...itemsData, [item.id]: item },
    })
  },

  moveItem: (sourceIndex, destinationIndex) => {
    const { formId, itemIds } = get()
    if (!formId) return

    const newItemIds = [...itemIds]
    const [movedId] = newItemIds.splice(sourceIndex, 1)
    newItemIds.splice(destinationIndex, 0, movedId)

    set({ itemIds: newItemIds })
  },

  getFormSchema: () => {
    const { formId, formTitle, formDescription, itemIds, itemsData } = get()
    if (!formId) return null

    return {
      id: formId,
      title: formTitle,
      description: formDescription,
      items: itemIds.map((id) => itemsData[id]),
    }
  },
}))
