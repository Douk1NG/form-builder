import { DynamicIcon } from 'lucide-react/dynamic'
import { Plus, X, Layers, Columns2 } from 'lucide-react'
import { useFieldPalette } from '@/playground/hooks/useFieldPalette'
import { fieldTypeOptions } from '@/playground/utils/fieldTypeOptions'
import { useMobilePaletteHud } from '@/playground/hooks/useMobilePaletteHud'
import { useTranslation } from 'react-i18next'

export function MobilePaletteHud() {
    const {
        previewMode,
        isLayoutDisabled,
        handleAddField,
        handleAddGroup,
        handleAddRow
    } = useFieldPalette()

    const { isHudOpen, toggleHud, closeHud } = useMobilePaletteHud()

    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.controls'
    })

    if (previewMode) return null

    return (
        <>
            {/* Floating Action Button */}
            <button
                type="button"
                onClick={toggleHud}
                className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-xl"
                aria-label="Toggle field palette"
            >
                {isHudOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Plus className="w-6 h-6" />
                )}
            </button>

            {/* Backdrop overlay */}
            {isHudOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity"
                    onClick={closeHud}
                />
            )}

            {/* Slide-up HUD Panel */}
            <div
                className={`fixed bottom-16 left-0 right-0 z-45 transition-transform duration-300 ease-out ${
                    isHudOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="mx-3 mb-2 bg-card/95 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Layout Section — horizontal row */}
                    {!isLayoutDisabled && (
                        <div className="px-4 pt-4 pb-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2 block">
                                {translations('layout.title')}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleAddGroup()
                                        closeHud()
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20 text-xs font-semibold transition-all active:scale-95"
                                >
                                    <Layers className="w-4 h-4" />
                                    {translations('layout.group')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleAddRow()
                                        closeHud()
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/10 text-violet-600 border border-violet-500/20 text-xs font-semibold transition-all active:scale-95"
                                >
                                    <Columns2 className="w-4 h-4" />
                                    {translations('layout.twoColumnRow')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mx-4 border-t border-border/30" />

                    {/* Fields Section — horizontal swipable */}
                    <div className="px-4 pt-2 pb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2 block">
                            {translations('fields')}
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-none">
                            {fieldTypeOptions.map((fieldType) => (
                                <button
                                    key={fieldType.type}
                                    type="button"
                                    onClick={() => {
                                        handleAddField(fieldType.type, fieldType.label)
                                        closeHud()
                                    }}
                                    className="flex flex-col items-center justify-center gap-1.5 min-w-[72px] h-[76px] rounded-xl bg-muted/40 border border-border/30 text-foreground/80 transition-all active:scale-95 active:bg-primary/10 snap-start shrink-0"
                                >
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                        <DynamicIcon name={fieldType.icon} className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-semibold leading-tight text-center px-1">
                                        {fieldType.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
