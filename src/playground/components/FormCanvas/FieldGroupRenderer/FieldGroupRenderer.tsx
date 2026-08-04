import { GripVertical, Trash2, Layers, ArrowUp, ArrowDown, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { resolveLocalizedString } from '@/utils/locales'
import type { Field } from '@/types/form'
import { GroupFieldItem } from './GroupFieldItem'
import { GroupDropZone } from './GroupDropZone'
import { useFieldGroupRendererCard } from '@/playground/hooks/useFieldGroupRendererCard'
import { useTranslation } from 'react-i18next'

export type FieldGroupRendererProps = {
  groupId: string
  index: number
}

export function FieldGroupRenderer({ groupId, index }: FieldGroupRendererProps) {
  const {
    group,
    isLocked,
    handleSelectGroup,
    handleRemoveGroup,
    handleMoveUp,
    handleMoveDown,
    handleRemoveFieldFromGroup,
    handleKeyDown,
    handleToggleLock,
    elementRef,
    dragHandleRef,
    isDragging,
    closestEdge,
    computedBorderClass,
    emptySlotCount,
  } = useFieldGroupRendererCard(groupId, index)

  const { t: translations } = useTranslation("translation", {
    keyPrefix: "playground.fields.group"
  })

  if (!group) return null

  const draggingClassValue = 'opacity-40 scale-[0.98] shadow-none border-dashed'
  const draggingClass = isDragging ? draggingClassValue : ''

  const lockedClassValues = {
    header: 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10',
    icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    label: 'text-emerald-600 dark:text-emerald-400'
  }

  const unlockedClassValues = {
    header: 'border-border/40 bg-muted/30 hover:bg-muted/50',
    icon: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    label: 'text-violet-600 dark:text-violet-400'
  }

  const headerClass = isLocked ? lockedClassValues.header : unlockedClassValues.header
  const iconClass = isLocked ? lockedClassValues.icon : unlockedClassValues.icon
  const labelClass = isLocked ? lockedClassValues.label : unlockedClassValues.label

  const lockGroupTranslationLabel = isLocked
    ? translations('status.unlock')
    : translations('status.lock')

  const groupColumnsClass = group.columns === 2 ? 'md:grid-cols-2' : ''

  const closestEdgeMap = {
    isTopEdge: closestEdge === 'top',
    isBottomEdge: closestEdge === 'bottom',
  }

  return (
    <div
      ref={elementRef}
      className={`relative group rounded-2xl border transition-all duration-200 backdrop-blur-md ${computedBorderClass} ${draggingClass}`}
    >
      {/* Group Header */}
      <div
        className={`flex items-center gap-2.5 px-4 py-3.5 cursor-pointer border-b rounded-t-2xl transition-colors backdrop-blur-sm ${headerClass}`}
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
        <div className={`p-1.5 rounded-lg ${iconClass}`}>
          <Layers className={`h-4 w-4 ${labelClass}`} />
        </div>
        <span className={`font-bold text-base text-foreground tracking-tight flex-1 ${labelClass}`}>
          {resolveLocalizedString(group.label)}
        </span>

        {isLocked && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            {translations('status.locked')}
          </span>
        )}

        {group.columns && group.columns > 1 && (
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 mr-1">
            {group.columns} Columns
          </span>
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-md hover:bg-muted ${labelClass}`}
            onClick={handleToggleLock}
            title={lockGroupTranslationLabel}
          >
            {isLocked ?
              <Lock className="h-3.5 w-3.5" /> :
              <Unlock className="h-3.5 w-3.5" />
            }
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md hover:bg-muted"
            onClick={handleMoveUp}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md hover:bg-muted"
            onClick={handleMoveDown}
          >
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
      <div className={`p-5 grid gap-4 grid-cols-1 ${groupColumnsClass}`}>
        {group.items.map((groupItem, itemIndex) => {
          const { kind, id } = groupItem
          if (kind === 'field_group') {
            return <FieldGroupRenderer
              key={id}
              groupId={id}
              index={itemIndex}
            />
          }

          return (
            <GroupFieldItem
              key={id}
              field={groupItem as Field}
              groupId={groupId}
              index={itemIndex}
              onRemove={handleRemoveFieldFromGroup(id)}
            />
          )
        })}

        {Array.from({ length: emptySlotCount }).map((_, slotIndex) => {
          const customLabel = group.columns === 2 
            ? 'Drop field' 
            : undefined
          
          return (
            <GroupDropZone 
              key={`dropzone-${slotIndex}`} 
              groupId={groupId} 
              label={customLabel}
            />
          )
        })}
      </div>


      {closestEdgeMap.isTopEdge && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary rounded-t-2xl z-20 pointer-events-none" />
      )}
      {closestEdgeMap.isBottomEdge && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-b-2xl z-20 pointer-events-none" />
      )}
    </div>
  )
}