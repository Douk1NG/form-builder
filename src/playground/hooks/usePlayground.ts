import { useFormBuilderStore } from '@/playground/store/useFormBuilderStore'

export function usePlayground() {
  const formId = useFormBuilderStore((state) => state.formId)
  const formTitle = useFormBuilderStore((state) => state.formTitle)
  const setPreviewMode = useFormBuilderStore((state) => state.setPreviewMode)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)
  const previewDevice = useFormBuilderStore((state) => state.previewDevice)
  const setPreviewDevice = useFormBuilderStore((state) => state.setPreviewDevice)

  const handleTogglePreview = () => {
    setPreviewMode(!previewMode)
  }

  const handleExportJson = () => {
    const currentForm = getFormSchema()
    if (!currentForm) return
    const jsonString = JSON.stringify(currentForm, null, 2)
    const fileBlob = new Blob([jsonString], { type: 'application/json' })
    const fileUrl = URL.createObjectURL(fileBlob)
    const downloadAnchor = document.createElement('a')

    downloadAnchor.href = fileUrl
    downloadAnchor.download = `${currentForm.title || 'form'}.json`
    downloadAnchor.click()

    URL.revokeObjectURL(fileUrl)
  }

  return {
    formId,
    formTitle,
    previewMode,
    previewDevice,
    setPreviewDevice,
    handleTogglePreview,
    handleExportJson,
  }
}
