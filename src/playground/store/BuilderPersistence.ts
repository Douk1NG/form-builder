import type { CanvasItem } from '../../types/form'
import type { SavedForm } from './slices/FormDocuments'
import type { FormBuilderState } from './useFormBuilderStore'

export type PersistedFormBuilderState = {
    formId: string | null
    formTitle: string
    formDescription: string
    itemIds: string[]
    itemsData: Record<string, CanvasItem>
    savedForms: Record<string, SavedForm>
}

export function partializeFormBuilderState(state: FormBuilderState): PersistedFormBuilderState {
    return {
        formId: state.formId,
        formTitle: state.formTitle,
        formDescription: state.formDescription,
        itemIds: state.itemIds,
        itemsData: state.itemsData,
    } as PersistedFormBuilderState
}

export const formBuilderPersistConfig = {
    name: 'form-builder-store',
    partialize: partializeFormBuilderState,
}