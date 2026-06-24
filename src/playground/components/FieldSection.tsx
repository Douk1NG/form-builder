import { Layers } from 'lucide-react'
import { PaletteItem } from './PaletteItem'
import { fieldTypeOptions } from '@/playground/utils/fieldTypeOptions'
import type { FieldType } from '@/types/form'
import { useTranslation } from 'react-i18next'

type FieldsSectionProps = {
    onAddField: (
        type: FieldType,
        label: string
    ) => void
}

export function FieldsSection({ onAddField }: FieldsSectionProps) {
    const {
        t: translations
    } = useTranslation('translation', {
        keyPrefix: 'playground.controls'
    })

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base tracking-tight text-foreground">{translations('fields')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {fieldTypeOptions.map((fieldType) => (
                    <PaletteItem
                        key={fieldType.type}
                        type={fieldType.type}
                        label={fieldType.label}
                        icon={fieldType.icon}
                        onClick={() => onAddField(fieldType.type, fieldType.label)}
                    />
                ))}
            </div>
        </div>
    )
}