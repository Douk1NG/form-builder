import { useGroupDropZone } from '@/playground/hooks/useGroupDropZone'

export type GroupDropZoneProps = {
  groupId: string
}

export function GroupDropZone({ groupId }: GroupDropZoneProps) {
  const { dropRef, isOver } = useGroupDropZone(groupId)

  return (
    <div
      ref={dropRef}
      className={`rounded-xl border-2 border-dashed transition-all duration-200 py-6 flex items-center justify-center ${isOver ? 'border-primary/50 bg-primary/10 shadow-inner' : 'border-border/40 bg-muted/20 hover:border-primary/30'
        }`}
    >
      <p className="text-sm font-medium text-muted-foreground/60">
        {isOver ? 'Drop field here' : 'Drop a field or use buttons below'}
      </p>
    </div>
  )
}
