import { useState, type KeyboardEvent } from 'react'
import { useFormBuilderStore } from '../store/useFormBuilderStore'

export function usePlayground() {
  const formId = useFormBuilderStore((state) => state.formId)
  const formTitle = useFormBuilderStore((state) => state.formTitle)
  const createForm = useFormBuilderStore((state) => state.createForm)
  const setPreviewMode = useFormBuilderStore((state) => state.setPreviewMode)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema)

  const [newTitle, setNewTitle] = useState('')

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value)
  }

  const handleCreate = () => {
    createForm(newTitle.trim() || 'Untitled Form')
    setNewTitle('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCreate()
    }
  }

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
    newTitle,
    handleTitleChange,
    handleCreate,
    handleKeyDown,
    handleTogglePreview,
    handleExportJson,
  }
}
