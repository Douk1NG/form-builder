import React, { useEffect, useRef, useState } from 'react'
import { dropTargetForElements, draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { attachClosestEdge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { GripVertical, Trash2, Layers, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFieldGroupRenderer } from '@/playground/hooks/useFieldGroupRenderer'
import { resolveLocalizedString } from '@/utils/locales'
import type { Field } from '@/types/form'
import { GroupFieldItem } from './GroupFieldItem'
import { GroupDropZone } from './GroupDropZone'

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

  const dragRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [closestEdge, setClosestEdge] = useState<string | null>(null)

  useEffect(() => {
    const element = dragRef.current
    const handle = dragHandleRef.current
    if (!element || !handle) return

    const cleanupDraggable = draggable({
      element,
      dragHandle: handle,
      getInitialData: () => ({ id: groupId, index, source: 'canvas' }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: ({ input }) => {
        return attachClosestEdge(
          { id: groupId, index },
          { element, input, allowedEdges: ['top', 'bottom', 'left', 'right'] }
        )
      },
      onDragEnter: ({ self }) => {
        setIsDragOver(true)
        setClosestEdge(extractClosestEdge(self.data))
      },
      onDrag: ({ self }) => {
        setClosestEdge(extractClosestEdge(self.data))
      },
      onDragLeave: () => {
        setIsDragOver(false)
        setClosestEdge(null)
      },
      onDrop: () => {
        setIsDragOver(false)
        setClosestEdge(null)
      },
    })

    return () => {
      cleanupDraggable()
      cleanupDropTarget()
    }
  }, [groupId, index])

  if (!group) return null

  const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
  const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/70 hover:shadow-sm'
  const dragOverStyles = 'border-primary/40 shadow-sm bg-card/80'

  const borderClass = isSelected ? selectedStyles : isDragOver ? dragOverStyles : defaultStyles

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleSelectGroup(event)
    }
  }

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
        onKeyDown={handleKeyDown}
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
      <div className={`p-5 grid gap-4 grid-cols-1 ${group.columns === 2 ? 'md:grid-cols-2' : ''} ${group.columns === 3 ? 'md:grid-cols-3' : ''} ${group.columns === 4 ? 'md:grid-cols-4' : ''}`}>
        {group.items.map((groupItem) => {
          if (groupItem.kind === 'field_group') {
            return <FieldGroupRenderer key={groupItem.id} groupId={groupItem.id} index={0} />
          }

          return (
            <GroupFieldItem
              key={groupItem.id}
              field={groupItem as Field}
              groupId={groupId}
              onRemove={handleRemoveFieldFromGroup(groupItem.id)}
            />
          )
        })}

        {(() => {
          const emptySlots = group.columns ? Math.max(1, group.columns - group.items.length) : 1
          return Array.from({ length: emptySlots }).map((_, i) => (
            <GroupDropZone key={`dropzone-${i}`} groupId={groupId} />
          ))
        })()}
      </div>

      {closestEdge === 'top' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary rounded-t-2xl z-20 pointer-events-none" />
      )}
      {closestEdge === 'bottom' && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-b-2xl z-20 pointer-events-none" />
      )}
      {closestEdge === 'left' && (
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary rounded-l-2xl z-20 pointer-events-none" />
      )}
      {closestEdge === 'right' && (
        <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-primary rounded-r-2xl z-20 pointer-events-none" />
      )}
    </div>
  )
}
