import { generateUuid } from '../../../lib/utils'
import type { StateCreator } from 'zustand'
import type { CanvasItem, FormStyle } from '../../../types/form'
import type { FormBuilderState } from '../useFormBuilderStore'

export type SavedForm = {
    formId: string
    formTitle: string
    formDescription: string
    itemIds: string[]
    itemsData: Record<string, CanvasItem>
    formStyle?: FormStyle
}

export type FormDocumentSlice = {
    formId: string
    formTitle: string
    formDescription: string
    formStyle: FormStyle
    savedForms: Record<string, SavedForm>

    createNewForm: (title: string) => void
    switchForm: (formId: string) => void
    updateFormTitle: (title: string) => void
    updateFormStyle: (style: Partial<FormStyle>) => void
    deleteForm: (formId: string) => void
}

export const createFormDocumentSlice: StateCreator<FormBuilderState, [], [], FormDocumentSlice> = (set, get) => ({
    formId: '',
    formTitle: '',
    formDescription: '',
    formStyle: { backgroundColor: '', fontFamily: 'sans' },
    savedForms: {},

    createNewForm: (title) => {
        const {
            formId,
            formTitle,
            formDescription,
            formStyle,
            itemIds,
            itemsData,
            savedForms
        } = get()

        const newSavedForms = { ...savedForms }
        if (formId) {
            newSavedForms[formId] = {
                formId,
                formTitle,
                formDescription,
                formStyle,
                itemIds,
                itemsData,
            }
        }

        const newFormId = generateUuid()
        const defaultStyle: FormStyle = { backgroundColor: '', fontFamily: 'sans' }

        newSavedForms[newFormId] = {
            formId: newFormId,
            formTitle: title,
            formDescription: '',
            formStyle: defaultStyle,
            itemIds: [],
            itemsData: {},
        }

        set({
            formId: newFormId,
            formTitle: title,
            formDescription: '',
            formStyle: defaultStyle,
            itemIds: [],
            itemsData: {},
            selectedItemId: null,
            savedForms: newSavedForms,
        })
    },

    switchForm: (targetFormId) => {
        const { formId, formTitle, formDescription, formStyle, itemIds, itemsData, savedForms } = get()

        if (formId === targetFormId) return

        const newSavedForms = { ...savedForms }
        if (formId) {
            newSavedForms[formId] = {
                formId,
                formTitle,
                formDescription,
                formStyle,
                itemIds,
                itemsData,
            }
        }

        const targetForm = newSavedForms[targetFormId]
        if (!targetForm) return

        const targetStyle = targetForm.formStyle || { backgroundColor: '', fontFamily: 'sans' }

        set({
            formId: targetForm.formId,
            formTitle: targetForm.formTitle,
            formDescription: targetForm.formDescription,
            formStyle: targetStyle,
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

    updateFormStyle: (styleUpdates) => {
        const { formId, formStyle, savedForms } = get()
        if (!formId) return

        const newStyle = { ...formStyle, ...styleUpdates }
        const newSavedForms = { ...savedForms }
        if (newSavedForms[formId]) {
            newSavedForms[formId] = {
                ...newSavedForms[formId],
                formStyle: newStyle,
            }
        }

        set({
            formStyle: newStyle,
            savedForms: newSavedForms,
        })
    },

    deleteForm: (targetFormId) => {
        const { formId, savedForms } = get()

        const newSavedForms = { ...savedForms }
        delete newSavedForms[targetFormId]

        if (formId === targetFormId) {
            const remainingFormIds = Object.keys(newSavedForms)
            if (remainingFormIds.length > 0) {
                const nextFormId = remainingFormIds[0]
                const nextForm = newSavedForms[nextFormId]
                const targetStyle = nextForm.formStyle || { backgroundColor: '', fontFamily: 'sans' }
                set({
                    formId: nextForm.formId,
                    formTitle: nextForm.formTitle,
                    formDescription: nextForm.formDescription,
                    formStyle: targetStyle,
                    itemIds: nextForm.itemIds,
                    itemsData: nextForm.itemsData,
                    selectedItemId: null,
                    savedForms: newSavedForms,
                })
            } else {
                set({
                    formId: '',
                    formTitle: '',
                    formDescription: '',
                    formStyle: { backgroundColor: '', fontFamily: 'sans' },
                    itemIds: [],
                    itemsData: {},
                    selectedItemId: null,
                    savedForms: newSavedForms,
                })
            }
        } else {
            set({
                savedForms: newSavedForms,
            })
        }
    }
})