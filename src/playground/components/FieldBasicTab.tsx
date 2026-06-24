import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LocalizedInput } from '@/playground/components/LocalizedInput'
import type { LocalizedString } from '@/types/form'
import { useTranslation } from 'react-i18next'

export type FieldBasicTabProps = {
    label: LocalizedString
    name?: string
    description?: LocalizedString
    placeholder?: LocalizedString
    onLabelChange: (value: LocalizedString) => void
    onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onDescriptionChange: (value: LocalizedString) => void
    onPlaceholderChange: (value: LocalizedString) => void
}

export function FieldBasicTab({
    label,
    name,
    description,
    placeholder,
    onLabelChange,
    onNameChange,
    onDescriptionChange,
    onPlaceholderChange
}: FieldBasicTabProps) {
    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.properties.basic'
    })

    return (
        <div className="space-y-4">
            <LocalizedInput
                id="field-label"
                label={translations('label.title')}
                value={label}
                onChange={onLabelChange}
                placeholder={translations('label.placeholder')}
            />

            <div className="space-y-2">
                <Label
                    htmlFor="field-name"
                    className="text-sm font-medium"
                >
                    {translations('name.title')}
                </Label>
                <Input
                    id="field-name"
                    value={name}
                    onChange={onNameChange}
                    placeholder={translations('name.placeholder')}
                    className="font-mono text-sm transition-all focus:ring-primary/30 rounded-lg"
                />
            </div>

            <LocalizedInput
                id="field-description"
                label={translations('description.title')}
                value={description}
                onChange={onDescriptionChange}
                placeholder={translations('description.placeholder')}
            />

            <LocalizedInput
                id="field-placeholder"
                label={translations('placeholder.title')}
                value={placeholder}
                onChange={onPlaceholderChange}
                placeholder={translations('placeholder.placeholder')}
            />
        </div>
    )
}