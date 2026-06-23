import { useTranslation } from 'react-i18next'
import { useFieldRenderer } from '../hooks/useFieldRenderer'
import { CanvasFieldWrapper } from './CanvasFieldWrapper'
import FieldComponent from '../../components/form/field'

export type FieldRendererProps = {
  id: string
  index: number
}

export function FieldRenderer({ id, index }: FieldRendererProps) {
  const { t } = useTranslation()
  const {
    field,
    isSelected,
    handleSelect,
    handleMoveUp,
    handleMoveDown,
    handleRemove,
  } = useFieldRenderer(id)

  if (!field || field.kind !== 'field') return null

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
      {/* @ts-expect-error - dynamic key for translation */}
      <FieldComponent {...field as Omit<typeof field, 'id' | 'kind'>} translate={(key: string) => String(t(key))} />
    </CanvasFieldWrapper>
  )
}
