import { Settings2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/playground/hooks/useIsMobile'

export function EmptyPropertiesPanel() {
    const isMobile = useIsMobile()
    const { t: translation } = useTranslation(
        'translation',
        { keyPrefix: 'playground.properties' }
    )

    const heightClass = isMobile ? 'min-h-[45vh]' : 'h-full'

    return (
        <div className={`flex flex-col items-center justify-center ${heightClass} text-center text-muted-foreground p-4`}>
            <div className="p-4 mb-4 rounded-2xl bg-primary/5">
                <Settings2 className="w-8 h-8 text-primary/40" />
            </div>
            <p className="text-base font-semibold text-foreground/70">
                {translation('title')}
            </p>
            <p className="text-sm mt-1 text-muted-foreground/70">
                {translation('emptyPlaceholder')}
            </p>
        </div>
    )
}