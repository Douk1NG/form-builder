import { getPreviewFrameConfig } from '@/playground/utils/previewFrameConfig'
import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'
import { useTranslation } from 'react-i18next'
import FormBuilder from '@/components/form'
import type { ActionResponse } from '@/types/form'
import type { FormSchema } from '@/playground/store/slices/CanvasItems'

export type PreviewFormRendererProps = {
    currentFormSchema: FormSchema
    simulateSubmit: (id: string | undefined, previousState: ActionResponse | null, formData: FormData) => Promise<ActionResponse>
}

export function PreviewFormRenderer({ currentFormSchema, simulateSubmit }: PreviewFormRendererProps) {
    const previewLocale = useFormBuilderStore((state) => state.previewLocale)
    const previewDevice = useFormBuilderStore((state) => state.previewDevice)
    const { t } = useTranslation()

    const {
        maxWidthClassName,
        frameClassName
    } = getPreviewFrameConfig(previewDevice)

    return (
        <div className="min-h-[calc(100vh-100px)] p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[24px_24px] -m-8 flex items-start justify-center">
            <div className={`w-full transition-all duration-300 ease-in-out ${maxWidthClassName}`}>
                <div className={frameClassName}>
                    <div className="p-8 h-full max-h-[80vh] overflow-y-auto custom-scrollbar">
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
            </div>
        </div>
    )
}