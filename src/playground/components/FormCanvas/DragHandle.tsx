import { GripVertical } from 'lucide-react'
import { forwardRef } from 'react'

export type DragHandleProps = {
    onClick?: (event: React.MouseEvent) => void
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
    function DragHandle({ onClick }, reference) {
        const handleClick = (event: React.MouseEvent) => {
            event.stopPropagation()
            onClick?.(event)
        }

        return (
            <button
                ref={reference}
                type="button"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                onClick={handleClick}
            >
                <GripVertical className="h-4 w-4" />
            </button>
        )
    }
)
