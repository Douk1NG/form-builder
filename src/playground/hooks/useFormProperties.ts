import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FormStyle } from '@/types/form'

export function useFormProperties() {
  const formId = useFormBuilderStore((state) => state.formId)
  const formTitle = useFormBuilderStore((state) => state.formTitle)
  const formDescription = useFormBuilderStore((state) => state.formDescription)
  const formStyle = useFormBuilderStore((state) => state.formStyle)
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle)
  const updateFormStyle = useFormBuilderStore((state) => state.updateFormStyle)

  const handleTitleChange = (title: string) => {
    updateFormTitle(title)
  }

  const handleStyleChange = (key: keyof FormStyle, value: string) => {
    updateFormStyle({ [key]: value })
  }

  return {
    formId,
    formTitle,
    formDescription,
    formStyle,
    handleTitleChange,
    handleStyleChange
  }
}
