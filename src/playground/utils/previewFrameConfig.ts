import type { BuilderUiSlice } from "@/playground/store/slices/BuilderUI"

export type PreviewDevice = BuilderUiSlice['previewDevice']

export type PreviewFrameConfig = {
    maxWidthClassName: string
    frameClassName: string
}

export function getPreviewFrameConfig(previewDevice: PreviewDevice): PreviewFrameConfig {
    if (previewDevice === 'desktop') {
        return {
            maxWidthClassName: 'max-w-4xl',
            frameClassName: 'border rounded-xl shadow-2xl shadow-black/10 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50',
        }
    }

    if (previewDevice === 'tablet') {
        return {
            maxWidthClassName: 'max-w-2xl',
            frameClassName: 'border-[8px] rounded-[2.5rem] shadow-2xl shadow-black/15 overflow-hidden bg-card border-zinc-800 dark:border-zinc-900',
        }
    }

    return {
        maxWidthClassName: 'max-w-[375px]',
        frameClassName: 'border-[12px] border-b-[36px] border-t-[36px] rounded-[3rem] shadow-2xl shadow-black/15 overflow-hidden bg-card border-zinc-800 dark:border-zinc-900',
    }
}