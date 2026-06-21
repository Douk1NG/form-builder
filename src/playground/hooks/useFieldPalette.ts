import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType, Field } from '../../types/form'

export function useFieldPalette() {
  const addField = useFormBuilderStore((state) => state.addField)
  const previewMode = useFormBuilderStore((state) => state.previewMode)

  const handleAddField = (type: FieldType, label: string) => {
    const newFieldBase = {
      type,
      label: `New ${label}`,
      name: `field_${crypto.randomUUID().slice(0, 8)}`,
      description: '',
      placeholder: ''
    }
    addField(newFieldBase as Omit<Field, 'id'>)
  }

  return {
    previewMode,
    handleAddField,
  }
}
