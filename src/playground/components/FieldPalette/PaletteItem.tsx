import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { usePaletteItemDrag } from '@/playground/hooks/usePaletteItemDrag';
import type { FieldType } from '@/types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export type PaletteItemProps = {
  type: FieldType | typeof ITEM_KINDS.FIELD_GROUP | typeof ITEM_KINDS.COLUMN_ROW
  label: string
  icon: IconName
  onClick: () => void
  disabled?: boolean
}

export function PaletteItem({ type, label, icon, onClick, disabled }: PaletteItemProps) {
  const {
    buttonRef,
    isDragging
  } = usePaletteItemDrag({ type, label, disabled })

  const disabledStyles = 'opacity-40 cursor-not-allowed bg-muted/10 border-transparent pointer-events-none'
  const activeStyles = 'hover:border-primary/20 bg-muted/20 hover:bg-primary/5 hover:shadow-sm cursor-grab active:cursor-grabbing'

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      className={`group flex flex-col items-center justify-center p-3 h-24 rounded-2xl border border-transparent transition-all duration-200 w-full gap-2.5 ${disabled ? disabledStyles : activeStyles} ${isDragging ? 'opacity-50 scale-95 border-primary/40 border-dashed bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <div className={`p-2.5 rounded-xl bg-primary/10 ${disabled ? 'text-muted-foreground' : 'text-primary group-hover:scale-110'} transition-transform duration-200`}>
        <DynamicIcon name={icon} className="w-5 h-5" />
      </div>
      <span className={`font-semibold text-xs ${disabled ? 'text-muted-foreground/60' : 'text-foreground/80 group-hover:text-foreground'} text-center leading-tight`}>{label}</span>
    </button>
  )
}

