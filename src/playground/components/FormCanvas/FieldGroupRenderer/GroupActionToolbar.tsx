import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, Trash2, Lock, Unlock } from 'lucide-react'

export type GroupActionToolbarProps = {
    isLocked: boolean
    lockLabel: string
    labelClass: string
    onToggleLock: (event: React.MouseEvent) => void
    onMoveUp: (event: React.MouseEvent) => void
    onMoveDown: (event: React.MouseEvent) => void
    onRemove: (event: React.MouseEvent) => void
}

export function GroupActionToolbar({
    isLocked,
    lockLabel,
    labelClass,
    onToggleLock,
    onMoveUp,
    onMoveDown,
    onRemove,
}: GroupActionToolbarProps) {
    return (
        <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1">
            <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-md hover:bg-muted ${labelClass}`}
                onClick={onToggleLock}
                title={lockLabel}
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
                onClick={onMoveUp}
            >
                <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-muted"
                onClick={onMoveDown}
            >
                <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-border mx-0.5" />
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onRemove}
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    )
}
