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
      className={`flex-1 relative group/slot rounded-xl border-2 transition-all duration-200 min-h-20 ${field
          ? 'border-border/30 bg-card/70 p-3 shadow-xs'
          : isOver
            ? 'border-primary/50 border-dashed bg-primary/10 shadow-inner'
            : 'border-dashed border-border/40 bg-muted/30 flex items-center justify-center hover:border-primary/30 transition-colors cursor-default'
        }`}
    >
      {field ? (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover/slot:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10 rounded-md"
            onClick={onRemoveField}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <div className="pointer-events-none opacity-90">
            <FieldComponent {...field as Omit<typeof field, 'id'>} />
          </div>
        </>
      ) : (
        <p className="text-sm font-medium text-muted-foreground/60 text-center px-2">
          {isOver ? 'Drop field here' : 'Drop a field'}
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

  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/60 hover:shadow-sm'

  const borderClass = isSelected ? selectedStyles : defaultStyles

  return (
    <div
      ref={dragRef}
      className={`relative group rounded-xl border transition-all duration-200 cursor-pointer backdrop-blur-md ${borderClass} ${isDragging ? 'opacity-40 scale-[0.98] shadow-none border-dashed' : ''}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleSelect(event as unknown as React.MouseEvent)
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        {!groupId && (
          <button
            ref={dragHandleRef}
            type="button"
            className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <Columns2 className="h-4 w-4 text-violet-500/70" />
        <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">2-Column Layout</span>
      </div>

      <div className="flex gap-4 p-4 pt-2">
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

      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1 z-10">
        {!groupId && (
          <>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted" onClick={handleMoveUp}>
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted" onClick={handleMoveDown}>
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-border mx-0.5" />
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

