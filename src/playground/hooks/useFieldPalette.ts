import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType, Field } from '../../types/form'
import { findItemById } from '@/playground/utils/findItemById'

export function useFieldPalette() {
  const addField = useFormBuilderStore((state) => state.addField)
  const addGroup = useFormBuilderStore((state) => state.addGroup)
  const addRow = useFormBuilderStore((state) => state.addRow)
  const addFieldToGroup = useFormBuilderStore((state) => state.addFieldToGroup)
  const addGroupToGroup = useFormBuilderStore((state) => state.addGroupToGroup)
  const addRowToGroup = useFormBuilderStore((state) => state.addRowToGroup)
  const previewMode = useFormBuilderStore((state) => state.previewMode)
  const lockedGroupId = useFormBuilderStore((state) => state.lockedGroupId)
  const itemsData = useFormBuilderStore((state) => state.itemsData)

  const lockedGroup = lockedGroupId ? findItemById(itemsData, lockedGroupId) : null
  const isLockedGroupTwoColumns = lockedGroup && lockedGroup.kind === 'field_group' && (lockedGroup.columns || 0) > 1

  const handleAddField = (type: FieldType, label: string) => {
    const newFieldBase = {
      type,
      label: `New ${label}`,
      name: `field_${crypto.randomUUID().slice(0, 8)}`,
      description: '',
      placeholder: ''
    }

    if (lockedGroupId) {
      addFieldToGroup(lockedGroupId, newFieldBase as Omit<Field, 'id'>)
    } else {
      addField(newFieldBase as Omit<Field, 'id'>)
    }
  }

  const handleAddGroup = () => {
    if (lockedGroupId) {
      if (isLockedGroupTwoColumns) return // Restriction: no groups inside 2-column row
      addGroupToGroup(lockedGroupId, 'Field Group')
    } else {
      addGroup('Field Group')
    }
  }

  const handleAddRow = () => {
    if (lockedGroupId) {
      if (isLockedGroupTwoColumns) return // Restriction: no groups inside 2-column row
      addRowToGroup(lockedGroupId)
    } else {
      addRow(2)
    }
  }

  return {
    previewMode,
    isLayoutDisabled: !!isLockedGroupTwoColumns,
    handleAddField,
    handleAddGroup,
    handleAddRow,
  }
}
