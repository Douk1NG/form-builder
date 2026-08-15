import { Layers } from 'lucide-react'
import { resolveLocalizedString } from '@/utils/locales'
import type { Field } from '@/types/form'
import { GroupFieldItem } from './GroupFieldItem'
import { GroupDropZone } from './GroupDropZone'
import { GroupActionToolbar } from './GroupActionToolbar'
import { MobileGroupActionMenu } from './MobileGroupActionMenu'
import { useFieldGroupRendererCard } from '@/playground/hooks/useFieldGroupRendererCard'
import { ITEM_KINDS } from '@/types/itemKinds'
import { EdgeIndicators } from '@/playground/components/FormCanvas/EdgeIndicators'
import { DragHandle } from '@/playground/components/FormCanvas/DragHandle'
import { FieldGroupRenderer as NestedFieldGroupRenderer } from './FieldGroupRenderer'
import { useIsMobile } from '@/playground/hooks/useIsMobile'
import { useMobilePropertiesHud } from '@/playground/hooks/useMobilePropertiesHud'

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
    handleReorderFieldInGroup,
    handleKeyDown,
    handleToggleLock,
    elementRef,
    dragHandleRef,
    closestEdge,
    computedBorderClass,
    emptySlotCount,
    draggingClass,
    headerClass,
    accentStyles,
    lockGroupTranslationLabel,
    groupColumnsClass,
    translations
  } = useFieldGroupRendererCard(groupId, index)

  const isMobile = useIsMobile()
  const { openPropertiesHud } = useMobilePropertiesHud()

  if (!group) return null

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
        {!isMobile && <DragHandle ref={dragHandleRef} />}
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

        {isMobile ? (
          <MobileGroupActionMenu
            isLocked={isLocked}
            lockLabel={lockGroupTranslationLabel}
            onToggleLock={handleToggleLock}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRemove={handleRemoveGroup}
            onOpenProperties={() => {
              handleSelectGroup()
              openPropertiesHud()
            }}
          />
        ) : (
          <GroupActionToolbar
            isLocked={isLocked}
            lockLabel={lockGroupTranslationLabel}
            labelClass={accentStyles.label}
            onToggleLock={handleToggleLock}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRemove={handleRemoveGroup}
          />
        )}
      </div>

      {/* Group Body */}
      <div className={`p-5 grid gap-4 grid-cols-1 ${groupColumnsClass} form-group-grid`}>
        {group.items.map((groupItem, itemIndex) => {
          const { kind, id } = groupItem
          if (kind === ITEM_KINDS.FIELD_GROUP) {
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
              onMoveUp={handleReorderFieldInGroup(id, 'up')}
              onMoveDown={handleReorderFieldInGroup(id, 'down')}
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

      {!isMobile && <EdgeIndicators closestEdge={closestEdge} borderRadius="2xl" />}
    </div>
  )
}