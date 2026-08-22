'use client'

import { useFormState } from '../../hooks/use-form-state'
import { useFormFields } from '../../hooks/use-form-fields'

import { InheritanceProvider } from '../../context/InheritanceProvider'

import FieldComponent from './field'
import FormAlert from './alert'
import FormSubmitButton from './submit'
import FieldError from './field-error'

import type { FormProps, Field, CanvasItem, FieldGroup } from '../../types/form'
import { resolveLocalizedString } from '../../utils/locales'
import { ITEM_KINDS } from '../../types/itemKinds'

const FormBuilder = ({
    fields,
    values,
    locale = 'en',
    translate = (key) => key,
    submitLabel,
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

    const renderField = (item: Field) => {
        if (!item.name) return null
        return (
            <div
                className="space-y-2 p-4 -mx-4 rounded-xl border border-transparent hover:border-border/40 hover:bg-muted/10 transition-colors"
                key={item.name}
            >
                <FieldComponent
                    {...item}
                    label={translate(resolveLocalizedString(item.label, locale))}
                    {...(item.description ? { description: translate(resolveLocalizedString(item.description, locale)) } : {})}
                    value={state.data?.[item.name]}
                    readOnly={isDetail}
                    translate={translate}
                />
                <FieldError
                    {...(state?.errors?.[item.name]?.at(0) ? { error: resolveLocalizedString(state.errors[item.name]?.[0], locale) } : {})}
                    translate={translate}
                />
            </div>
        )
    }

    const renderItem = (item: Field | CanvasItem): React.ReactNode => {
        if ('kind' in item) {
            if (item.kind === ITEM_KINDS.FIELD_GROUP) {
                const group = item as FieldGroup;
                const groupColumnsClass = Number(group.columns) === 2 ? 'md:grid-cols-2' : '';
                const resolvedLabel = translate(resolveLocalizedString(group.label, locale));
                const isBorderless = group.borderless === true
                const isHeaderHidden = group.hideHeader === true

                const groupContainerClass = isBorderless
                    ? 'space-y-6'
                    : 'space-y-6 p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm'

                const groupInlineStyles: React.CSSProperties = {}
                if (group.style?.backgroundColor) {
                    groupInlineStyles.backgroundColor = group.style.backgroundColor
                }
                if (group.style?.borderColor && !isBorderless) {
                    groupInlineStyles.borderColor = group.style.borderColor
                }
                if (group.style?.borderStyle === 'none') {
                    groupInlineStyles.borderStyle = 'none'
                } else if (group.style?.borderStyle) {
                    groupInlineStyles.borderStyle = group.style.borderStyle
                }

                const titleInlineStyles: React.CSSProperties = {}
                if (group.style?.titleColor) {
                    titleInlineStyles.color = group.style.titleColor
                }
                if (group.style?.titleTransform === 'uppercase') {
                    titleInlineStyles.textTransform = 'uppercase'
                    titleInlineStyles.letterSpacing = '0.05em'
                }

                const shouldShowLabel = resolvedLabel && !isHeaderHidden

                return (
                    <div key={group.id} className={groupContainerClass} style={groupInlineStyles}>
                        {shouldShowLabel && (
                            <h3
                                className="font-bold text-xl tracking-tight text-foreground"
                                style={titleInlineStyles}
                            >
                                {resolvedLabel}
                            </h3>
                        )}
                        <div className={`grid gap-4 grid-cols-1 ${groupColumnsClass} form-group-grid`}>
                            {group.items.map((groupItem, index) => (
                                <div key={'id' in groupItem ? groupItem.id : index}>
                                    {renderItem(groupItem)}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            if (item.kind === 'field') {
                return renderField(item as Field)
            }
        }
        
        // Plain field fallback
        return renderField(item as Field)
    }

    return (
        <InheritanceProvider getFieldValue={getFieldValue} onChange={handleFieldChange}>
            <div className="form-container">
                <form
                    action={formAction}
                    className='flex flex-col gap-8'
                >
                <div className="space-y-8">
                    {fields.map((item, index) => (
                        <div key={'id' in item && item.id ? item.id : index}>
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
                {showFailMessage &&
                    (<FormAlert message={resolveLocalizedString(state.message, locale)} translate={translate} />)
                }
                {!isDetail &&
                    (<div className="pt-4 border-t border-border/50">
                        <FormSubmitButton
                            isPending={isPending}
                            label={submitLabel ? resolveLocalizedString(submitLabel, locale) : undefined}
                            translate={translate}
                        />
                    </div>)
                }
                </form>
            </div>
        </InheritanceProvider>
    )
}

export default FormBuilder
