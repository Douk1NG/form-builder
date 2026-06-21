import { create } from 'zustand'
import type { Field } from '../../types/form'

export type FormSchema = {
  id: string
  title: string
  description?: string
  fields: Field[]
}

export type FormBuilderState = {
  formId: string | null
  formTitle: string
  formDescription: string
  fieldIds: string[]
  fieldsData: Record<string, Field>
  
  selectedFieldId: string | null
  previewMode: boolean
  
  createForm: (title: string) => void
  addField: (field: Omit<Field, 'id'>) => void
  updateField: (fieldId: string, updates: Partial<Field>) => void
  removeField: (fieldId: string) => void
  reorderField: (fieldId: string, direction: 'up' | 'down') => void
  setSelectedField: (fieldId: string | null) => void
  setPreviewMode: (enabled: boolean) => void
  insertFieldAt: (index: number, field: Omit<Field, 'id'>) => void
  moveField: (sourceIndex: number, destinationIndex: number) => void
  
  getFormSchema: () => FormSchema | null
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formId: null,
  formTitle: '',
  formDescription: '',
  fieldIds: [],
  fieldsData: {},
  
  selectedFieldId: null,
  previewMode: false,

  createForm: (title) => {
    set({
      formId: crypto.randomUUID(),
      formTitle: title,
      formDescription: '',
      fieldIds: [],
      fieldsData: {},
      selectedFieldId: null,
    })
  },

  addField: (field) => {
    const { formId, fieldIds, fieldsData } = get()
    if (!formId) return

    const id = crypto.randomUUID()
    const newField: Field = { ...field, id } as Field

    set({
      fieldIds: [...fieldIds, id],
      fieldsData: {
        ...fieldsData,
        [id]: newField,
      },
    })
  },

  updateField: (fieldId, updates) => {
    const { formId, fieldsData } = get()
    if (!formId || !fieldsData[fieldId]) return

    set({
      fieldsData: {
        ...fieldsData,
        [fieldId]: {
          ...fieldsData[fieldId],
          ...updates,
        } as Field,
      },
    })
  },

  removeField: (fieldId) => {
    const { formId, fieldIds, fieldsData, selectedFieldId } = get()
    if (!formId) return

    const newFieldIds = fieldIds.filter((id) => id !== fieldId)
    const newFieldsData = { ...fieldsData }
    delete newFieldsData[fieldId]

    set({
      fieldIds: newFieldIds,
      fieldsData: newFieldsData,
      selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
    })
  },

  reorderField: (fieldId, direction) => {
    const { formId, fieldIds } = get()
    if (!formId) return

    const index = fieldIds.indexOf(fieldId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === fieldIds.length - 1) return

    const newFieldIds = [...fieldIds]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    const temp = newFieldIds[index]
    newFieldIds[index] = newFieldIds[swapIndex]
    newFieldIds[swapIndex] = temp

    set({
      fieldIds: newFieldIds,
    })
  },

  setSelectedField: (fieldId) => {
    set({ selectedFieldId: fieldId })
  },

  setPreviewMode: (enabled) => {
    set({ previewMode: enabled })
  },

  insertFieldAt: (index, field) => {
    const { formId, fieldIds, fieldsData } = get()
    if (!formId) return

    const id = crypto.randomUUID()
    const newField: Field = { ...field, id } as Field

    const newFieldIds = [...fieldIds]
    newFieldIds.splice(index, 0, id)

    set({
      fieldIds: newFieldIds,
      fieldsData: {
        ...fieldsData,
        [id]: newField,
      },
    })
  },

  moveField: (sourceIndex, destinationIndex) => {
    const { formId, fieldIds } = get()
    if (!formId) return

    const newFieldIds = [...fieldIds]
    const [movedId] = newFieldIds.splice(sourceIndex, 1)
    newFieldIds.splice(destinationIndex, 0, movedId)

    set({
      fieldIds: newFieldIds,
    })
  },

  getFormSchema: () => {
    const { formId, formTitle, formDescription, fieldIds, fieldsData } = get()
    if (!formId) return null

    return {
      id: formId,
      title: formTitle,
      description: formDescription,
      fields: fieldIds.map((id) => fieldsData[id]),
    }
  }
}))
