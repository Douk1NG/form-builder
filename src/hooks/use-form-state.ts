import { useActionState, useEffect } from 'react'
import type { ActionResponse } from '../types/form'

export function useFormState(
    action: any,
    values: Record<string, unknown>,
    onEditModeChange?: (editing: boolean) => void,
    isEditing?: boolean,
    isCreating?: boolean,
    onSuccess?: (state: ActionResponse) => void,
    onError?: (error: any) => void
) {
    const actionWithId = action.bind(null, values?.['id'] as string)
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

    useEffect(() => {
        if (isDetail && state.success) {
            state.success = false
            state.message = ''
            state.errors = {}
        }
    }, [isDetail, state])

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
        state,
        formAction,
        isPending,
        isDetail
    }
}
