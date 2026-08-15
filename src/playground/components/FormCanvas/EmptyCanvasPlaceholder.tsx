import { MousePointerClick, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/playground/hooks/useIsMobile'

export function EmptyCanvasPlaceholder() {
    const isMobile = useIsMobile()

    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.builder'
    })

    return (
        <div className="flex flex-col items-center justify-center h-64 p-12 text-center rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 text-muted-foreground pointer-events-none">
            <div className="p-4 mb-4 rounded-2xl bg-primary/5">
                {isMobile ? (
                    <Sparkles className="w-8 h-8 text-primary/50" />
                ) : (
                    <MousePointerClick className="w-8 h-8 text-primary/50" />
                )}
            </div>
            <p className="text-base font-semibold text-foreground/60">
                {isMobile
                    ? translations('mobileAddTitle')
                    : translations('dragDropTitle')
                }
            </p>
            <p className="text-sm mt-1.5 text-muted-foreground/70 max-w-xs">
                {isMobile
                    ? translations('mobileAddDescription')
                    : translations('dragDropDescription')
                }
            </p>
        </div>
    )
}