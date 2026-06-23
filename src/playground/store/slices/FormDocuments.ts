import type { StateCreator } from 'zustand'
import type { CanvasItem } from '../../../types/form'
import type { FormBuilderState } from '../useFormBuilderStore'

export type SavedForm = {
    formId: string
    formTitle: string
    formDescription: string
    itemIds: string[]
    itemsData: Record<string, CanvasItem>
}

export type FormDocumentSlice = {
    formId: string | null
    formTitle: string
    formDescription: string
    savedForms: Record<string, SavedForm>

    createNewForm: (title: string) => void
    switchForm: (formId: string) => void
    updateFormTitle: (title: string) => void
}

export const createFormDocumentSlice: StateCreator<FormBuilderState, [], [], FormDocumentSlice> = (set, get) => ({
    formId: null,
    formTitle: '',
    formDescription: '',
    savedForms: {},

    createNewForm: (title) => {
        const { formId, formTitle, formDescription, itemIds, itemsData, savedForms } = get()

        const newSavedForms = { ...savedForms }
        if (formId) {
            newSavedForms[formId] = {
                formId,
                formTitle,
                formDescription,
                itemIds,
                itemsData,
            }
        }

        const newFormId = crypto.randomUUID()

        newSavedForms[newFormId] = {
            formId: newFormId,
            formTitle: title,
            formDescription: '',
            itemIds: [],
            itemsData: {},
        }

        set({
            formId: newFormId,
            formTitle: title,
            formDescription: '',
            itemIds: [],
            itemsData: {},
            selectedItemId: null,
            savedForms: newSavedForms,
        })
    },

    switchForm: (targetFormId) => {
        const { formId, formTitle, formDescription, itemIds, itemsData, savedForms } = get()

        if (formId === targetFormId) return

        const newSavedForms = { ...savedForms }
        if (formId) {
            newSavedForms[formId] = {
                formId,
                formTitle,
                formDescription,
                itemIds,
                itemsData,
            }
        }

        const targetForm = newSavedForms[targetFormId]
        if (!targetForm) return

        set({
            formId: targetForm.formId,
            formTitle: targetForm.formTitle,
            formDescription: targetForm.formDescription,
            itemIds: targetForm.itemIds,
            itemsData: targetForm.itemsData,
            selectedItemId: null,
            savedForms: newSavedForms,
        })
    },

    updateFormTitle: (title) => {
        const { formId, savedForms } = get()

        const newSavedForms = { ...savedForms }
        if (formId && newSavedForms[formId]) {
            newSavedForms[formId] = {
                ...newSavedForms[formId],
                formTitle: title,
            }
        }

        set({
            formTitle: title,
            savedForms: newSavedForms,
        })
    },
})