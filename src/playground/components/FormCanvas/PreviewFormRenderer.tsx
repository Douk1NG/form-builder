import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useTranslation } from 'react-i18next'
import FormBuilder from '@/components/form'
import type { ActionResponse } from '@/types/form'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'
import { Wifi, Battery, Signal, Globe, ChevronLeft, ChevronRight, RotateCw, Sparkles } from 'lucide-react'

export type PreviewFormRendererProps = {
    currentFormSchema: FormSchema
    simulateSubmit: (id: string | undefined, previousState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
}

export function PreviewFormRenderer({ currentFormSchema, simulateSubmit }: PreviewFormRendererProps) {
    const previewLocale = useFormBuilderStore((state) => state.previewLocale)
    const previewDevice = useFormBuilderStore((state) => state.previewDevice)
    const { t } = useTranslation()

    // Determine layout wraps and aspect ratio bounds depending on target device
    const renderDeviceFrame = () => {
        if (previewDevice === 'desktop') {
            return (
                <div className="w-full h-full border border-border/60 bg-card shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-in-out flex flex-col">
                    {/* Browser Window Header */}
                    <div className="flex items-center gap-4 px-4 py-3 bg-muted/30 border-b border-border/50 shrink-0">
                        {/* Traffic light control window buttons */}
                        <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90 border border-rose-600/40" />
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-400/90 border border-amber-500/40" />
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 border border-emerald-600/40" />
                        </div>
                        {/* Navigation controls */}
                        <div className="flex items-center gap-1 text-muted-foreground/60">
                            <ChevronLeft className="w-4 h-4 cursor-not-allowed" />
                            <ChevronRight className="w-4 h-4 cursor-not-allowed" />
                            <RotateCw className="w-3.5 h-3.5 ml-1.5 hover:text-foreground cursor-pointer" />
                        </div>
                        {/* Browser Address Bar */}
                        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border/50 text-xs text-muted-foreground">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                            <span className="truncate select-none">http://localhost:5173/preview/form-builder</span>
                        </div>
                        {/* Right utility slot */}
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary/80 animate-pulse" />
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-card/60">
                        <FormBuilder
                            fields={currentFormSchema.items}
                            values={{}}
                            locale={previewLocale}
                            translate={t as (key: string) => string}
                            action={simulateSubmit}
                            isCreating={true}
                        />
                    </div>
                </div>
            )
        }

        if (previewDevice === 'tablet') {
            return (
                <div className="relative h-full aspect-3/4 min-w-150 border-14 border-slate-950 dark:border-slate-800 bg-card rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
                    {/* Tablet Camera lens */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 z-30" />

                    {/* Status Bar */}
                    <div className="h-7 px-6 flex items-center justify-between text-[11px] font-bold select-none text-foreground/80 bg-muted/10 border-b border-border/20 z-20 shrink-0">
                        <span>10:09 AM</span>
                        <div className="flex items-center gap-1.5">
                            <Signal className="w-3 h-3" />
                            <Wifi className="w-3.5 h-3.5" />
                            <Battery className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-card">
                        <FormBuilder
                            fields={currentFormSchema.items}
                            values={{}}
                            locale={previewLocale}
                            translate={t as (key: string) => string}
                            action={simulateSubmit}
                            isCreating={true}
                        />
                    </div>
                </div>
            )
        }

        // Mobile Device Frame
        return (
            <div className="relative h-full aspect-9/16 min-w-[320px] border-14 border-slate-950 dark:border-slate-800 bg-card rounded-[3rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
                {/* Dynamic Island Notch */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-slate-950 z-30 flex items-center justify-end px-2.5 shadow-inner">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-950 border border-indigo-900" />
                </div>

                {/* Status Bar */}
                <div className="h-11 px-6 pt-3 flex items-center justify-between text-[11px] font-bold select-none text-foreground bg-muted/10 z-20 shrink-0">
                    <span className="pl-1">9:41</span>
                    <div className="flex items-center gap-1.5 pr-1">
                        <Signal className="w-3.5 h-3.5" />
                        <Wifi className="w-3.5 h-3.5" />
                        <Battery className="w-4 h-4 text-emerald-500" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-5 py-6 overflow-y-auto custom-scrollbar bg-card">
                    <FormBuilder
                        fields={currentFormSchema.items}
                        values={{}}
                        locale={previewLocale}
                        translate={t as (key: string) => string}
                        action={simulateSubmit}
                        isCreating={true}
                    />
                </div>

                {/* Home Indicator Bar */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-slate-950 dark:bg-slate-300/40 z-30 shrink-0" />
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-80px)] p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px] -m-8 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                {renderDeviceFrame()}
            </div>
        </div>
    )
}