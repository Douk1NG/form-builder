import { Button } from '../../components/ui/button'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

export type FieldActionToolbarProps = {
    onMoveUp: (event: React.MouseEvent) => void
    onMoveDown: (event: React.MouseEvent) => void
    onRemove: (event: React.MouseEvent) => void
}

export function FieldActionToolbar({
    onMoveUp,
    onMoveDown,
    onRemove
}: FieldActionToolbarProps) {
    return (
        <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-0.5 bg-card/95 backdrop-blur-sm shadow-lg shadow-black/5 border border-border/60 rounded-lg p-1 z-10">
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