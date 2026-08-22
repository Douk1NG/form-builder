import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LocalizedInput } from './LocalizedInput'
import { useTranslation } from 'react-i18next'
import type { LocalizedString } from '@/types/form'

export type FieldBasicTabProps = {
    label: LocalizedString
    name?: string
    description?: LocalizedString
    placeholder?: LocalizedString
    onLabelChange: (value: LocalizedString) => void
    onNameChange: (name: string) => void
    onDescriptionChange: (value: LocalizedString) => void
    onPlaceholderChange: (value: LocalizedString) => void
}

export function FieldBasicTab({
    label,
    name = '',
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

    const [localName, setLocalName] = useState(name)
    const [prevName, setPrevName] = useState(name)

    if (name !== prevName) {
        setLocalName(name)
        setPrevName(name)
    }

    const onNameChangeRef = useRef(onNameChange)
    
    useEffect(() => {
        onNameChangeRef.current = onNameChange
    }, [onNameChange])

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleLocalNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        setLocalName(val)

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            onNameChangeRef.current(val)
        }, 150)
    }

    const handleNameBlur = () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
            onNameChangeRef.current(localName)
        }
    }

    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [])

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
                    value={localName}
                    onChange={handleLocalNameChange}
                    onBlur={handleNameBlur}
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