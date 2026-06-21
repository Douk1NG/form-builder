import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { GripVertical, Trash2, Layers, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useFieldGroupRenderer } from '../hooks/useFieldGroupRenderer'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import FieldComponent from '../../components/form/field'
import { ColumnRowRenderer } from './ColumnRowRenderer'
import type { Field, ColumnRow } from '../../types/form'

type GroupFieldItemProps = {
  field: Field
  groupId: string
  onRemove: (event: React.MouseEvent) => void
}

function GroupFieldItem({ field, onRemove }: GroupFieldItemProps) {
  return (
    <div className="relative group/field rounded-lg border border-border/40 bg-card/60 p-3 transition-all hover:border-primary/30">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-6 w-6 opacity-0 group-hover/field:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 z-10"
        onClick={onRemove}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      <div className="pointer-events-none opacity-80">
        <FieldComponent {...field as Omit<typeof field, 'id'>} />
      </div>
    </div>
  )
}

type GroupDropZoneProps = {
  groupId: string
}

function GroupDropZone({ groupId }: GroupDropZoneProps) {
  const dropRef = useRef<HTMLDivElement>(null)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => ({ groupId }),
      canDrop: ({ source }) => source.data.source === 'palette',
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    })
  }, [groupId])

  return (
    <div
      ref={dropRef}
      className={`rounded-lg border-2 border-dashed transition-all py-4 flex items-center justify-center ${
        isOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border/30 bg-transparent'
      }`}
    >
      <p className="text-xs text-muted-foreground/60">
        {isOver ? 'Drop field here' : 'Drop a field or use buttons below'}
      </p>
    </div>
  )
}

export type FieldGroupRendererProps = {
  groupId: string
  index: number
}

export function FieldGroupRenderer({ groupId, index }: FieldGroupRendererProps) {
  const {
    group,
    isSelected,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
  } = useFieldGroupRenderer(groupId)

  const addColumnRowToGroup = useFormBuilderStore((state) => state.addColumnRowToGroup)

  const dragRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const element = dragRef.current
    const handle = dragHandleRef.current
    if (!element || !handle) return

    return draggable({
      element,
      dragHandle: handle,
      getInitialData: () => ({ id: groupId, index, source: 'canvas' }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [groupId, index])

  if (!group) return null

  const borderClass = isSelected
    ? 'border-primary ring-4 ring-primary/10 shadow-lg'
    : 'border-border/50 hover:border-primary/30'

  return (
    <div
      ref={dragRef}
      className={`relative group rounded-2xl border-2 transition-all backdrop-blur-sm bg-card/40 ${borderClass} ${isDragging ? 'opacity-50 scale-[0.98] shadow-none border-dashed' : ''}`}
    >
      {/* Group Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer border-b border-border/30 rounded-t-2xl bg-card/60 backdrop-blur-sm"
        onClick={handleSelectGroup}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') handleSelectGroup(event as unknown as React.MouseEvent)
        }}
      >
        <button
          ref={dragHandleRef}
          type="button"
          className="p-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          onClick={(event) => event.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="p-1 rounded-md bg-violet-500/10">
          <Layers className="h-3.5 w-3.5 text-violet-500" />
        </div>
        <span className="font-semibold text-sm text-foreground flex-1">{group.label}</span>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card shadow-sm border border-border rounded-md p-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveUp}>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleMoveDown}>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemoveGroup}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Group Body */}
      <div className="p-4 space-y-3">
        {group.items.map((groupItem) => {
          if (groupItem.kind === 'column_row') {
            return (
              <ColumnRowRenderer
                key={(groupItem as ColumnRow).id}
                rowId={(groupItem as ColumnRow).id}
                index={0}
                groupId={groupId}
              />
            )
          }

          // Plain field — no `kind` property
          const field = groupItem as Field
          return (
            <GroupFieldItem
              key={field.id}
              field={field}
              groupId={groupId}
              onRemove={handleRemoveFieldFromGroup(field.id ?? '')}
            />
          )
        })}

        <GroupDropZone groupId={groupId} />

        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-dashed hover:border-primary/50 hover:bg-primary/5"
            onClick={() => addColumnRowToGroup(groupId)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add 2-Column Row
          </Button>
        </div>
      </div>
    </div>
  )
}
