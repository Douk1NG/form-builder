import { useFieldPalette } from '../../hooks/useFieldPalette'
import { FieldsSection } from './FieldSection'
import { LayoutSection } from './LayoutSection'

export function FieldPalette() {
  const {
    previewMode,
    handleAddField,
    handleAddGroup,
    handleAddRow
  } = useFieldPalette()

  if (previewMode) return null

  return (
    <div className="space-y-6">
      <LayoutSection
        onAddGroup={handleAddGroup}
        onAddRow={handleAddRow}
      />
      <FieldsSection
        onAddField={handleAddField}
      />
    </div>
  )
}