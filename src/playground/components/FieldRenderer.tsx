import { useFieldRenderer } from '../hooks/useFieldRenderer'
import { CanvasFieldWrapper } from './CanvasFieldWrapper'
import FieldComponent from '../../components/form/field'

export type FieldRendererProps = {
  id: string
  index: number
}

export function FieldRenderer({ id, index }: FieldRendererProps) {
  const {
    field,
    isSelected,
    handleSelect,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
  } = useFieldRenderer(id)

  if (!field) return null

  return (
    <CanvasFieldWrapper
      id={id}
      index={index}
      isSelected={isSelected}
      onSelect={handleSelect}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      onRemove={handleRemove}
    >
      <FieldComponent {...field as Omit<typeof field, 'id'>} />
    </CanvasFieldWrapper>
  )
}
