import { Button } from '../../components/ui/button'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

export type CanvasFieldWrapperProps = {
  isSelected: boolean
  onSelect: () => void
  onMoveUp: (event: React.MouseEvent) => void
  onMoveDown: (event: React.MouseEvent) => void
  onRemove: (event: React.MouseEvent) => void
  children: React.ReactNode
}

export function CanvasFieldWrapper({
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  children
}: CanvasFieldWrapperProps) {
  const borderClass = isSelected 
    ? 'border-primary ring-2 ring-primary/20' 
    : 'border-border hover:border-primary/50'

  return (
    <div 
      className={`relative group bg-card p-4 rounded-lg border-2 transition-all cursor-pointer ${borderClass}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onSelect()
        }
      }}
    >
      <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-card shadow-sm border border-border rounded-md p-1 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onMoveUp}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={onMoveDown}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="pointer-events-none opacity-80">
        {children}
      </div>
    </div>
  )
}
