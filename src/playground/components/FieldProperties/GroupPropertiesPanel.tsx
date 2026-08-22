import { Layers } from 'lucide-react'
import { LocalizedInput } from '@/playground/components/FieldProperties/LocalizedInput'
import { PropertiesSectionHeader } from '@/playground/components/FieldProperties/PropertiesSectionHeader'
import { FieldStyleTab } from '@/playground/components/FieldProperties/FieldStyleTab'
import { LabeledSwitchRow } from '@/playground/components/FieldProperties/LabeledSwitchRow'
import { useTranslation } from 'react-i18next'
import type { GroupStyle, LocalizedString } from '@/types/form'

export type GroupPropertiesPanelProps = {
    groupLabel: LocalizedString | undefined
    groupStyle: GroupStyle | undefined
    hideHeader: boolean
    borderless: boolean
    onLabelChange: (value: LocalizedString) => void
    onGroupStyleChange: (style: GroupStyle) => void
    onHideHeaderChange: (hideHeader: boolean) => void
    onBorderlessChange: (borderless: boolean) => void
}

export function GroupPropertiesPanel({
    groupLabel,
    groupStyle,
    hideHeader,
    borderless,
    onLabelChange,
    onGroupStyleChange,
    onHideHeaderChange,
    onBorderlessChange,
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

            <div className="border-t border-border/40 pt-4 space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Layout Flags</h4>
                <LabeledSwitchRow
                    id="group-hide-header"
                    label="Hide Header"
                    description="Removes the group title bar from the rendered form"
                    checked={hideHeader}
                    onCheckedChange={onHideHeaderChange}
                />
                <LabeledSwitchRow
                    id="group-borderless"
                    label="Borderless"
                    description="Removes border, shadow, and background from the group container"
                    checked={borderless}
                    onCheckedChange={onBorderlessChange}
                />
            </div>

            <div className="border-t border-border/40 pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Group Style</h4>
                <FieldStyleTab
                    isGroup={true}
                    groupStyle={groupStyle}
                    onGroupStyleChange={onGroupStyleChange}
                />
            </div>
        </div>
    )
}