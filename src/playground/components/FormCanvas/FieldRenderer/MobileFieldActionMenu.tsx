import { createPortal } from 'react-dom'
import { MoreVertical, ArrowUp, ArrowDown, Trash2, Settings } from 'lucide-react'
import { useMobileFieldActionMenu } from '@/playground/hooks/useMobileFieldActionMenu'

export type MobileFieldActionMenuProps = {
    onMoveUp: (event: React.MouseEvent) => void
    onMoveDown: (event: React.MouseEvent) => void
    onRemove: (event: React.MouseEvent) => void
    onOpenProperties: () => void
}

export function MobileFieldActionMenu({
    onMoveUp,
    onMoveDown,
    onRemove,
    onOpenProperties,
}: MobileFieldActionMenuProps) {
    const { isMenuOpen, menuPosition, toggleMenu, closeMenu } = useMobileFieldActionMenu()

    const handleAction = (handler: (event: React.MouseEvent) => void) => {
        return (event: React.MouseEvent) => {
            event.stopPropagation()
            closeMenu()
            handler(event)
        }
    }

    const handleOpenProperties = (event: React.MouseEvent) => {
        event.stopPropagation()
        closeMenu()
        onOpenProperties()
    }

    const dropdownPortal = isMenuOpen
        ? createPortal(
              <>
                  <div
                      className="fixed inset-0 z-40"
                      onClick={(event) => {
                          event.stopPropagation()
                          closeMenu()
                      }}
                  />
                  <div
                      className="fixed z-50 min-w-40 bg-card/98 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden"
                      style={{ top: menuPosition.top, right: menuPosition.right }}
                      onClick={(event) => event.stopPropagation()}
                  >
                      <button
                          type="button"
                          onClick={handleOpenProperties}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                      >
                          <Settings className="w-4 h-4 text-primary" />
                          Properties
                      </button>
                      <div className="mx-2 border-t border-border/30" />
                      <button
                          type="button"
                          onClick={handleAction(onMoveUp)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                      >
                          <ArrowUp className="w-4 h-4" />
                          Move Up
                      </button>
                      <button
                          type="button"
                          onClick={handleAction(onMoveDown)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                      >
                          <ArrowDown className="w-4 h-4" />
                          Move Down
                      </button>
                      <div className="mx-2 border-t border-border/30" />
                      <button
                          type="button"
                          onClick={handleAction(onRemove)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                          <Trash2 className="w-4 h-4" />
                          Delete
                      </button>
                  </div>
              </>,
              document.body
          )
        : null

    return (
        <div className="absolute right-2 top-2 z-30">
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation()
                    toggleMenu(event)
                }}
                onPointerDown={(event) => event.stopPropagation()}
                className="p-1.5 rounded-lg bg-card/95 backdrop-blur-sm border border-border/60 shadow-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>
            {dropdownPortal}
        </div>
    )
}
