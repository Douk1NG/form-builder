import { useFieldPalette } from '../hooks/useFieldPalette'
import { LayoutSection } from './LayoutSection'
import { FieldsSection } from './FieldSection'

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