import type { FieldType } from '../../types/form'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { usePaletteItemDrag } from '../hooks/usePaletteItemDrag';

export type PaletteItemProps = {
  type: FieldType | 'field_group' | 'column_row'
  label: string
  icon: IconName
  onClick: () => void
}

export function PaletteItem({ type, label, icon, onClick }: PaletteItemProps) {
  const {
    buttonRef,
    isDragging
  } = usePaletteItemDrag({ type, label })

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`group flex flex-col items-center justify-center p-3 h-24 rounded-2xl border border-transparent hover:border-primary/20 bg-muted/20 hover:bg-primary/5 hover:shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing w-full gap-2.5 ${isDragging ? 'opacity-50 scale-95 border-primary/40 border-dashed bg-primary/10' : ''}`}
      onClick={onClick}
    >
      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
        <DynamicIcon name={icon} className="w-5 h-5" />
      </div>
      <span className="font-semibold text-xs text-foreground/80 group-hover:text-foreground text-center leading-tight">{label}</span>
    </button>
  )
}

