import type { StateCreator } from 'zustand'
import type { CanvasItem } from '@/types/form'
import type { FormBuilderState } from '@/playground/store/useFormBuilderStore'
import { createCanvasListActions, type CanvasListActions } from './Canvas/CanvasListActions'
import { createCanvasGroupActions, type CanvasGroupActions } from './Canvas/CanvasGroupActions'

export type FormSchema = {
    id: string
    title: string
    description?: string
    items: CanvasItem[]
}

export type CanvasItemsSlice = CanvasListActions &
    CanvasGroupActions & {
        itemIds: string[]
        itemsData: Record<string, CanvasItem>
        getFormSchema: () => FormSchema | null
    }

export const createCanvasItemsSlice: StateCreator<FormBuilderState, [], [], CanvasItemsSlice> = (...args) => {
    const [, get] = args

    return {
        itemIds: [],
        itemsData: {},

        ...createCanvasListActions(...args),
        ...createCanvasGroupActions(...args),

        getFormSchema: () => {
            const { formId, formTitle, formDescription, itemIds, itemsData } = get()
            if (!formId) return null

            return {
                id: formId,
                title: formTitle,
                description: formDescription,
                items: itemIds.map((id) => itemsData[id]).filter(Boolean),
            }
        },
    }
}