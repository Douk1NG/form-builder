import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType, Field } from '../../types/form'

export function useFieldPalette() {
  const addField = useFormBuilderStore((state) => state.addField)
  const addGroup = useFormBuilderStore((state) => state.addGroup)
  const addRow = useFormBuilderStore((state) => state.addRow)
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

  const handleAddGroup = () => {
    addGroup('Field Group')
  }

  const handleAddRow = () => {
    addRow(2)
  }

  return {
    previewMode,
    handleAddField,
    handleAddGroup,
    handleAddRow,
  }
}
