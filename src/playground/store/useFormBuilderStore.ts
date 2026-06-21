import { create } from 'zustand'
import type { Field } from '../../types/form'

export type FormSchema = {
  id: string
  title: string
  description?: string
  fields: Field[]
}

export type FormBuilderState = {
  currentForm: FormSchema | null
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
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  currentForm: null,
  selectedFieldId: null,
  previewMode: false,

  createForm: (title) => {
    set({
      currentForm: {
        id: crypto.randomUUID(),
        title,
        fields: [],
      },
      selectedFieldId: null,
    })
  },

  addField: (field) => {
    const { currentForm } = get()
    if (!currentForm) return

    const newField: Field = {
      ...field,
      id: crypto.randomUUID(),
    } as Field

    set({
      currentForm: {
        ...currentForm,
        fields: [...currentForm.fields, newField],
      },
    })
  },

  updateField: (fieldId, updates) => {
    const { currentForm } = get()
    if (!currentForm) return

    set({
      currentForm: {
        ...currentForm,
        fields: currentForm.fields.map((f) => 
          f.id === fieldId ? { ...f, ...updates } as Field : f
        ),
      },
    })
  },

  removeField: (fieldId) => {
    const { currentForm, selectedFieldId } = get()
    if (!currentForm) return

    set({
      currentForm: {
        ...currentForm,
        fields: currentForm.fields.filter((f) => f.id !== fieldId),
      },
      selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
    })
  },

  reorderField: (fieldId, direction) => {
    const { currentForm } = get()
    if (!currentForm) return

    const index = currentForm.fields.findIndex(f => f.id === fieldId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === currentForm.fields.length - 1) return

    const newFields = [...currentForm.fields]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    
    const temp = newFields[index]
    newFields[index] = newFields[swapIndex]
    newFields[swapIndex] = temp

    set({
      currentForm: {
        ...currentForm,
        fields: newFields,
      },
    })
  },

  setSelectedField: (fieldId) => {
    set({ selectedFieldId: fieldId })
  },

  setPreviewMode: (enabled) => {
    set({ previewMode: enabled })
  },

  insertFieldAt: (index, field) => {
    const { currentForm } = get()
    if (!currentForm) return

    const newField: Field = {
      ...field,
      id: crypto.randomUUID(),
    } as Field

    const newFields = [...currentForm.fields]
    newFields.splice(index, 0, newField)

    set({
      currentForm: {
        ...currentForm,
        fields: newFields,
      },
    })
  },

  moveField: (sourceIndex, destinationIndex) => {
    const { currentForm } = get()
    if (!currentForm) return

    const newFields = [...currentForm.fields]
    const [movedField] = newFields.splice(sourceIndex, 1)
    newFields.splice(destinationIndex, 0, movedField)

    set({
      currentForm: {
        ...currentForm,
        fields: newFields,
      },
    })
  },
}))
