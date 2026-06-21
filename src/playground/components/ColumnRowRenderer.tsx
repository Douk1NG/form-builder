import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { GripVertical, Trash2, Columns2, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useColumnRowRenderer } from '../hooks/useColumnRowRenderer'
import FieldComponent from '../../components/form/field'
import type { Field } from '../../types/form'

type ColumnSlotProps = {
  slot: 'leftField' | 'rightField'
  field: Field | null
  rowId: string
  groupId?: string
  onRemoveField: (event: React.MouseEvent) => void
}

function ColumnSlot({ slot, field, rowId, groupId, onRemoveField }: ColumnSlotProps) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => ({ columnRowId: rowId, slot, groupId }),
      canDrop: ({ source }) => source.data.source === 'palette' && !field,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    })
  }, [rowId, slot, groupId, field])

  return (
    <div
      ref={dropRef}
      className={`flex-1 relative group/slot rounded-lg border-2 transition-all min-h-16 ${
        field
          ? 'border-border/40 bg-card/60 p-3'
          : isOver
            ? 'border-primary border-dashed bg-primary/5 scale-[1.01]'
            : 'border-dashed border-border/40 bg-muted/20 flex items-center justify-center cursor-default'
      }`}
    >
      {field ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/slot:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
            onClick={onRemoveField}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <div className="pointer-events-none opacity-80">
            <FieldComponent {...field as Omit<typeof field, 'id'>} />
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground text-center px-2">
          {isOver ? 'Drop here' : 'Drop a field'}
        </p>
      )}
    </div>
  )
}

export type ColumnRowRendererProps = {
  rowId: string
  index: number
  groupId?: string
}

export function ColumnRowRenderer({ rowId, index, groupId }: ColumnRowRendererProps) {
  const { row, isSelected, handleSelect, handleRemove, handleMoveUp, handleMoveDown, handleRemoveFieldFromSlot } =
    useColumnRowRenderer({ rowId, groupId })

  const dragRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = dragRef.current
    const handle = dragHandleRef.current
    if (!element || !handle || groupId) return

    return draggable({
      element,
      dragHandle: handle,
      getInitialData: () => ({ id: rowId, index, source: 'canvas' }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [rowId, index, groupId])

  if (!row) return null

  const borderClass = isSelected
    ? 'border-primary ring-4 ring-primary/10 shadow-md bg-card/90'
    : 'border-border/50 hover:border-primary/40 shadow-sm bg-card/50'

  return (
    <div
      ref={dragRef}
      className={`relative group rounded-xl border-2 transition-all cursor-pointer backdrop-blur-sm ${borderClass} ${isDragging ? 'opacity-50 scale-[0.98] shadow-none border-dashed' : ''}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleSelect(event as unknown as React.MouseEvent)
      }}
    >
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
        {!groupId && (
          <button
            ref={dragHandleRef}
            type="button"
            className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <Columns2 className="h-3.5 w-3.5 text-muted-foreground/60" />
        <span className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">2-Column Row</span>
      </div>

      <div className="flex gap-3 p-3 pt-1">
        <ColumnSlot
          slot="leftField"
          field={row.leftField}
          rowId={rowId}
          groupId={groupId}
          onRemoveField={handleRemoveFieldFromSlot('leftField')}
        />
        <ColumnSlot
          slot="rightField"
          field={row.rightField}
          rowId={rowId}
          groupId={groupId}
          onRemoveField={handleRemoveFieldFromSlot('rightField')}
        />
      </div>

      <div className="absolute right-3 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card shadow-sm border border-border rounded-md p-1 z-10">
        {!groupId && (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveUp}>
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveDown}>
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-border mx-0.5" />
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
