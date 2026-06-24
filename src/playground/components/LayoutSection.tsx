import { LayoutTemplate } from 'lucide-react'
import { PaletteItem } from './PaletteItem'
import { useTranslation } from 'react-i18next'

type LayoutSectionProps = {
    onAddGroup: () => void
    onAddRow: () => void
}

export function LayoutSection({
    onAddGroup,
    onAddRow
}: LayoutSectionProps) {

    const { t: translation } = useTranslation(
        'translation',
        { keyPrefix: 'playground.controls.layout' }
    )

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-500">
                    <LayoutTemplate className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base tracking-tight text-foreground">{translation('title')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <PaletteItem type="field_group" label={translation('group')} icon="Layers" onClick={onAddGroup} />
                <PaletteItem type="column_row" label={translation('twoColumnRow')} icon="Columns" onClick={onAddRow} />
            </div>
        </div>
    )
}