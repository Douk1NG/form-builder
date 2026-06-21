'use client'

import { useFormState } from '../../hooks/use-form-state'
import { useFormFields } from '../../hooks/use-form-fields'

import { InheritanceProvider } from '../../context/InheritanceProvider'

import Field from './field'
import FormAlert from './alert'
import FormSubmitButton from './submit'
import FieldError from './field-error'

import type { FormProps } from '../../types/form'

const FormBuilder = ({
    fields,
    values,
    translate = (key) => key,
    action,
    onEditModeChange,
    isEditing,
    isCreating,
    onSuccess,
    onError
}: FormProps) => {

    const {
        handleFieldChange,
        getFieldValue
    } = useFormFields(values)

    const {
        state,
        formAction,
        isPending,
        isDetail
    } = useFormState(
        action,
        values,
        onEditModeChange,
        isEditing,
        isCreating,
        onSuccess,
        onError
    )

    const showFailMessage = state?.message && !state.success

    return (
        <InheritanceProvider getFieldValue={getFieldValue} onChange={handleFieldChange}>
            <form
                action={formAction}
                className='flex flex-col gap-8'
            >
                <div className="space-y-8">
                    {fields.map((item) => {
                        if (!item.name) return null
                        return (
                            <div
                                className="space-y-2 p-4 -mx-4 rounded-xl border border-transparent hover:border-border/40 hover:bg-muted/10 transition-colors"
                                key={item.name}
                            >
                                <Field
                                    {...item}
                                    label={translate(item.label)}
                                    {...(item.description ? { description: translate(item.description) } : {})}
                                    value={state.data?.[item.name]}
                                    readOnly={isDetail}
                                    translate={translate}
                                />
                                <FieldError
                                    {...(state?.errors?.[item.name]?.at(0) ? { error: state.errors[item.name]?.[0] ?? '' } : {})}
                                />
                            </div>
                        )
                    })}
                </div>
                {showFailMessage &&
                    (<FormAlert message={state.message} />)
                }
                {!isDetail &&
                    (<div className="pt-4 border-t border-border/50">
                        <FormSubmitButton isPending={isPending} translate={translate} />
                    </div>)
                }
            </form>
        </InheritanceProvider>
    )
}

export default FormBuilder
