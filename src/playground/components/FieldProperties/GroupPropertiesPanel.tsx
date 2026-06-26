import { Layers } from 'lucide-react'
import { LocalizedInput } from '@/playground/components/FieldProperties/LocalizedInput'
import { PropertiesSectionHeader } from '@/playground/components/FieldProperties/PropertiesSectionHeader'
import { useTranslation } from 'react-i18next'
import type { LocalizedString } from '@/types/form'

export type GroupPropertiesPanelProps = {
    groupLabel: LocalizedString | undefined
    onLabelChange: (value: LocalizedString) => void
}

export function GroupPropertiesPanel({
    groupLabel,
    onLabelChange
}: GroupPropertiesPanelProps) {

    const {
        t: translation
    } = useTranslation(
        'translation',
        { keyPrefix: 'playground.properties.group' }
    )

    return (
        <div className="space-y-5">
            <PropertiesSectionHeader
                icon={<Layers className="w-5 h-5" />}
                title={translation('title')}
                accentColor="violet"
            />
            <LocalizedInput
                id="group-label"
                label={translation('label')}
                value={groupLabel ?? ''}
                onChange={onLabelChange}
                placeholder={translation('placeholder')}
            />
        </div>
    )
}