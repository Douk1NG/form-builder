import { useGroupDropZone } from '@/playground/hooks/useGroupDropZone'
import { useTranslation } from 'react-i18next'

export type GroupDropZoneProps = {
  groupId: string
}

export function GroupDropZone({ groupId }: GroupDropZoneProps) {
  const {
    dropRef,
    isOver
  } = useGroupDropZone(groupId)

  const {
    t: translations
  } = useTranslation('translation', {
    keyPrefix: 'playground.fields.group.dropZone'
  })

  return (
    <div
      ref={dropRef}
      className={`rounded-xl border-2 border-dashed transition-all duration-200 py-6 flex items-center justify-center ${isOver ? 'border-primary/50 bg-primary/10 shadow-inner' : 'border-border/40 bg-muted/20 hover:border-primary/30'
        }`}
    >
      <p className="text-sm font-medium text-muted-foreground/60">
        {isOver ? translations('title') : translations('titleAlt')}
      </p>
    </div>
  )
}
