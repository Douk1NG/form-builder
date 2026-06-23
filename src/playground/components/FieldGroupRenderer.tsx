import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { GripVertical, Trash2, Layers, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useFieldGroupRenderer } from '../hooks/useFieldGroupRenderer'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import FieldComponent from '../../components/form/field'
import { ColumnRowRenderer } from './ColumnRowRenderer'
import type { Field, ColumnRow } from '../../types/form'
import { resolveLocalizedString } from '../../utils/locales'

import { useTranslation } from 'react-i18next'

type GroupFieldItemProps = {
  field: Field
  groupId: string
  onRemove: (event: React.MouseEvent) => void
}

function GroupFieldItem({ field, onRemove }: GroupFieldItemProps) {
  const { t } = useTranslation()
  const setSelectedItem = useFormBuilderStore((state) => state.setSelectedItem)
  const selectedItemId = useFormBuilderStore((state) => state.selectedItemId)
  const isSelected = selectedItemId === field.id

  const handleSelect = (event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedItem(field.id ?? null)
  }

  const selectedStyles = 'border-primary/50 ring-1 ring-primary/20 shadow-sm shadow-primary/5'
  const defaultStyles = 'border-border/30 hover:border-primary/40 hover:shadow-xs'

  return (
    <div
      className={`relative group/field rounded-xl border bg-card/80 p-4 transition-all duration-200 cursor-pointer ${isSelected ? selectedStyles : defaultStyles}`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') handleSelect(event as unknown as React.MouseEvent)
      }}
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
        {/* @ts-expect-error - dynamic key for translation */}
        <FieldComponent {...field as Omit<typeof field, 'id'>} translate={(key: string) => String(t(key))} />
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
      className={`rounded-xl border-2 border-dashed transition-all duration-200 py-6 flex items-center justify-center ${
        isOver ? 'border-primary/50 bg-primary/10 shadow-inner' : 'border-border/40 bg-muted/20 hover:border-primary/30'
      }`}
    >
      <p className="text-sm font-medium text-muted-foreground/60">
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

  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/70 hover:shadow-sm'

  const borderClass = isSelected ? selectedStyles : defaultStyles

  return (
    <div
      ref={dragRef}
      className={`relative group rounded-2xl border transition-all duration-200 backdrop-blur-md ${borderClass} ${isDragging ? 'opacity-40 scale-[0.98] shadow-none border-dashed' : ''}`}
    >
      {/* Group Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer border-b border-border/40 rounded-t-2xl bg-muted/30 hover:bg-muted/50 transition-colors backdrop-blur-sm"
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
          className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
          onClick={(event) => event.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="p-1.5 rounded-lg bg-violet-500/15">
          <Layers className="h-4 w-4 text-violet-600 dark:text-violet-400" />
        </div>
        <span className="font-bold text-base text-foreground tracking-tight flex-1">{resolveLocalizedString(group.label)}</span>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted" onClick={handleMoveUp}>
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-muted" onClick={handleMoveDown}>
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemoveGroup}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Group Body */}
      <div className="p-5 space-y-4">
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

          // Plain field
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

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 border-dashed hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            onClick={() => addColumnRowToGroup(groupId)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add 2-Column Row
          </Button>
        </div>
      </div>
    </div>
  )
}

