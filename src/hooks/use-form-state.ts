import { useActionState, useEffect } from 'react'
import type { ActionResponse } from '../types/form'

export function useFormState(
    action: (id: string | undefined, prevState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>,
    values: Record<string, unknown>,
    onEditModeChange?: (editing: boolean) => void,
    isEditing?: boolean,
    isCreating?: boolean,
    onSuccess?: (state: ActionResponse) => void,
    onError?: (error: ActionResponse) => void
) {
    const actionWithId = action.bind(null, values?.['id'] as string | undefined)
    const isDetail = !isEditing && !isCreating
    const [
        state,
        formAction,
        isPending
    ] = useActionState(actionWithId, {
        success: false,
        message: '',
        errors: {},
        data: values
    } as ActionResponse)

    const resolvedState = isDetail ? {
        ...state,
        success: false,
        message: '',
        errors: {}
    } : state

    useEffect(() => {
        if (state.success) {
            onSuccess?.(state)
            if (!isCreating) {
                onEditModeChange?.(false)
            }
        } else if (state.message) {
            onError?.(state)
        }
    }, [state.success, state.message, onEditModeChange, isCreating, onSuccess, onError, state])

    return {
        state: resolvedState,
        formAction,
        isPending,
        isDetail
    }
}
