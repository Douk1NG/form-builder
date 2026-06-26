import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FieldComponent from '@/components/form/field'
import type { Field } from '@/types/form'
import { useGroupFieldItem } from '@/playground/hooks/useGroupFieldItem'

export type GroupFieldItemProps = {
  field: Field
  groupId: string
  onRemove: (event: React.MouseEvent) => void
}

export function GroupFieldItem({ field, onRemove }: GroupFieldItemProps) {
  const {
    isSelected,
    handleSelect,
    handleKeyDown
  } = useGroupFieldItem(field.id)

  const selectedStyles = 'border-primary/50 ring-1 ring-primary/20 shadow-sm shadow-primary/5'
  const defaultStyles = 'border-border/30 hover:border-primary/40 hover:shadow-xs'

  return (
    <div
      className={`relative group/field rounded-xl border bg-card/80 p-4 transition-all duration-200 cursor-pointer ${isSelected ? selectedStyles : defaultStyles}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover/field:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10 rounded-md"
        onClick={onRemove}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
      <div className="pointer-events-none opacity-90">
        <FieldComponent
          {...field}
        />
      </div>
    </div>
  )
}
