import { PreviewFormRenderer } from './PreviewFormRenderer'
import { useFormCanvas } from '@/playground/hooks/useFormCanvas'

export function MobilePreviewContent() {
  const { currentFormSchema, simulateSubmit } = useFormCanvas()

  if (!currentFormSchema) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
        Enter preview mode by enabling fields on the canvas first.
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-140px)]">
      <PreviewFormRenderer
        currentFormSchema={currentFormSchema}
        simulateSubmit={simulateSubmit}
      />
    </div>
  )
}
