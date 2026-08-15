import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { FieldProperties } from '@/playground/components/FieldProperties/FieldProperties'
import { useMobilePropertiesHud } from '@/playground/hooks/useMobilePropertiesHud'

export function MobilePropertiesHud() {
    const { isPropertiesHudOpen, closePropertiesHud } = useMobilePropertiesHud()

    if (!isPropertiesHudOpen) return null

    const modalContent = (
        <div className="fixed inset-0 z-999 flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70">
                    Properties
                </span>
                <button
                    type="button"
                    onClick={closePropertiesHud}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Scrollable Properties Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar min-h-0">
                <FieldProperties />
            </div>
        </div>
    )

    return createPortal(modalContent, document.body)
}

