import { useGroupDropZone } from '@/playground/hooks/useGroupDropZone'
import { useTranslation } from 'react-i18next'
import { useIsMobile } from '@/playground/hooks/useIsMobile'

export type GroupDropZoneProps = {
  groupId: string
  label?: string
}

export function GroupDropZone({ groupId, label }: GroupDropZoneProps) {
  const isMobile = useIsMobile()

  const {
    dropRef,
    isOver
  } = useGroupDropZone(groupId)

  const {
    t: translations
  } = useTranslation('translation', {
    keyPrefix: 'playground.fields.group.dropZone'
  })

  const mobileLabel = 'Use + to add fields'
  const desktopLabel = label ?? translations('titleAlt')
  const displayLabel = isMobile ? mobileLabel : desktopLabel

  return (
    <div
      ref={dropRef}
      className={`w-full rounded-xl border-2 border-dashed transition-all duration-200 py-6 flex items-center justify-center ${isOver ? 'border-primary/50 bg-primary/10 shadow-inner' : 'border-border/40 bg-muted/20 hover:border-primary/30'
        }`}
    >
      <p className="text-sm font-medium text-muted-foreground/60">
        {isOver ? translations('title') : displayLabel}
      </p>
    </div>
  )
}
