import { useFormBuilderStore } from '../store/useFormBuilderStore'
import type { FieldType, NewFieldInput } from '../../types/form'
import { findItemById } from '@/playground/utils/findItemById'
import { DEFAULT_GROUP_LABEL, FIELD_ID_SUFFIX_LENGTH, DEFAULT_TWO_COLUMN_COUNT } from '../constants/fieldDefaults'
import { ITEM_KINDS } from '@/types/itemKinds'

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
  const isLockedGroupTwoColumns = lockedGroup && lockedGroup.kind === ITEM_KINDS.FIELD_GROUP && (lockedGroup.columns || 0) > 1

  const handleAddField = (type: FieldType, label: string) => {
    const newFieldBase: NewFieldInput = {
      type,
      label: `New ${label}`,
      name: `field_${crypto.randomUUID().slice(0, FIELD_ID_SUFFIX_LENGTH)}`,
      description: '',
      placeholder: ''
    }

    if (lockedGroupId) {
      addFieldToGroup(lockedGroupId, newFieldBase)
    } else {
      addField(newFieldBase)
    }
  }

  const handleAddGroup = () => {
    if (!lockedGroupId) {
      addGroup(DEFAULT_GROUP_LABEL)
      return
    }
    if (isLockedGroupTwoColumns) return
    addGroupToGroup(lockedGroupId, DEFAULT_GROUP_LABEL)
  }

  const handleAddRow = () => {
    if (!lockedGroupId) {
      addRow(DEFAULT_TWO_COLUMN_COUNT)
      return
    }
    if (isLockedGroupTwoColumns) return
    addRowToGroup(lockedGroupId)
  }

  return {
    previewMode,
    isLayoutDisabled: !!isLockedGroupTwoColumns,
    handleAddField,
    handleAddGroup,
    handleAddRow,
  }
}
