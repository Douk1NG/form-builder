import { Layers } from 'lucide-react'
import { resolveLocalizedString } from '@/utils/locales'
import type { Field } from '@/types/form'
import { GroupFieldItem } from './GroupFieldItem'
import { GroupDropZone } from './GroupDropZone'
import { GroupActionToolbar } from './GroupActionToolbar'
import { useFieldGroupRendererCard } from '@/playground/hooks/useFieldGroupRendererCard'
import { useTranslation } from 'react-i18next'
import { EdgeIndicators } from '@/playground/components/FormCanvas/EdgeIndicators'
import { DragHandle } from '@/playground/components/FormCanvas/DragHandle'
import { FieldGroupRenderer as NestedFieldGroupRenderer } from './FieldGroupRenderer'

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

  const draggingClass = isDragging ? 'opacity-40 scale-[0.98] shadow-none border-dashed' : ''

  const lockedHeaderStyles = 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10'
  const unlockedHeaderStyles = 'border-border/40 bg-muted/30 hover:bg-muted/50'
  const headerClass = isLocked ? lockedHeaderStyles : unlockedHeaderStyles

  const lockedAccentStyles = { icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', label: 'text-emerald-600 dark:text-emerald-400' }
  const unlockedAccentStyles = { icon: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', label: 'text-violet-600 dark:text-violet-400' }
  const accentStyles = isLocked ? lockedAccentStyles : unlockedAccentStyles

  const lockGroupTranslationLabel = isLocked
    ? translations('status.unlock')
    : translations('status.lock')

  const groupColumnsClass = group.columns === 2 ? 'md:grid-cols-2' : ''

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
        <DragHandle ref={dragHandleRef} />
        <div className={`p-1.5 rounded-lg ${accentStyles.icon}`}>
          <Layers className={`h-4 w-4 ${accentStyles.label}`} />
        </div>
        <span className={`font-bold text-base text-foreground tracking-tight flex-1 ${accentStyles.label}`}>
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

        <GroupActionToolbar
          isLocked={isLocked}
          lockLabel={lockGroupTranslationLabel}
          labelClass={accentStyles.label}
          onToggleLock={handleToggleLock}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemove={handleRemoveGroup}
        />
      </div>

      {/* Group Body */}
      <div className={`p-5 grid gap-4 grid-cols-1 ${groupColumnsClass}`}>
        {group.items.map((groupItem, itemIndex) => {
          const { kind, id } = groupItem
          if (kind === 'field_group') {
            return <NestedFieldGroupRenderer
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

      <EdgeIndicators closestEdge={closestEdge} borderRadius="2xl" />
    </div>
  )
}