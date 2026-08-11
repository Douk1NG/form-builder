import { AmbientBackground } from './components/AmbientBackground'
import { FieldPalette } from './components/FieldPalette/FieldPalette'
import { FieldProperties } from './components/FieldProperties/FieldProperties'
import { FormCanvas } from './components/FormCanvas/FormCanvas'
import { PlaygroundHeader } from './components/PlaygroundHeader/PlaygroundHeader'
import { usePlaygroundLayout } from './hooks/usePlaygroundLayout'
import { NoFormSelectedPlaceholder } from './components/NoFormSelectedPlaceholder'
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function Playground() {
  const {
    formId,
    previewMode,
    isPaletteCollapsed,
    isPropertiesCollapsed,
    paletteSidebarWidth,
    propertiesSidebarWidth,
    handleTogglePalette,
    handleToggleProperties,
    hasSelectedItem,
    isMobilePaletteOpen,
    setIsMobilePaletteOpen,
    isMobilePropertiesOpen,
    setIsMobilePropertiesOpen,
  } = usePlaygroundLayout()

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      <AmbientBackground />
      <PlaygroundHeader />

      {formId ? (
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Left Palette Sidebar */}
          {!previewMode && (
            <aside className={`hidden md:flex relative flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/50 shadow-[2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-all duration-300 ease-in-out ${paletteSidebarWidth} ${isPaletteCollapsed ? '' : 'p-4 overflow-y-auto'}`}>
              {!isPaletteCollapsed && (
                <>
                  <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Palette</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleTogglePalette}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <FieldPalette />
                </>
              )}
            </aside>
          )}

          {/* Left Collapse Float Toggle */}
          {isPaletteCollapsed && !previewMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleTogglePalette}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full shadow-md bg-card/90 backdrop-blur-md hover:bg-muted border border-border/60 transition-all duration-200 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </Button>
          )}

          {/* Main workspace */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-transparent relative custom-scrollbar">
            <FormCanvas />
          </main>

          {/* Right Properties Sidebar */}
          {!previewMode && (
            <aside className={`hidden md:flex relative flex-col h-full bg-card/80 backdrop-blur-xl border-l border-border/50 shadow-[-2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-all duration-300 ease-in-out ${propertiesSidebarWidth} ${isPropertiesCollapsed ? '' : 'p-4 overflow-y-auto'}`}>
              {!isPropertiesCollapsed && (
                <>
                  <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleProperties}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Properties</span>
                  </div>
                  <FieldProperties />
                </>
              )}
            </aside>
          )}

          {/* Right Collapse Float Toggle */}
          {isPropertiesCollapsed && !previewMode && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleProperties}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full shadow-md bg-card/90 backdrop-blur-md hover:bg-muted border border-border/60 transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </Button>
          )}

          {/* Mobile Bottom Navigation Toolbar */}
          {formId && !previewMode && (
            <div className="fixed bottom-0 inset-x-0 h-16 md:hidden flex items-center justify-around bg-card/85 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 px-6 py-2">
              <Button
                variant="outline"
                onClick={() => setIsMobilePaletteOpen(true)}
                className="flex items-center gap-2 rounded-xl text-sm font-semibold px-4 py-2 border-border/60 hover:bg-muted cursor-pointer"
              >
                <Plus className="w-4 h-4 text-primary" />
                Add Component
              </Button>
              
              <Button
                variant="outline"
                disabled={!hasSelectedItem}
                onClick={() => setIsMobilePropertiesOpen(true)}
                className="flex items-center gap-2 rounded-xl text-sm font-semibold px-4 py-2 border-border/60 hover:bg-muted disabled:opacity-40 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-violet-500" />
                Properties
              </Button>
            </div>
          )}

          {/* Mobile Palette Bottom Sheet */}
          <Dialog open={isMobilePaletteOpen} onOpenChange={setIsMobilePaletteOpen}>
            <DialogContent className="fixed left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 max-w-full rounded-t-3xl border-t p-6 shadow-2xl z-50 bg-card max-h-[80vh] overflow-y-auto custom-scrollbar">
              <DialogHeader className="border-b border-border/40 pb-2 mb-4">
                <DialogTitle className="text-lg font-bold text-foreground">Add Component</DialogTitle>
              </DialogHeader>
              <div onClick={() => setIsMobilePaletteOpen(false)}>
                <FieldPalette />
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile Properties Bottom Sheet */}
          <Dialog open={isMobilePropertiesOpen} onOpenChange={setIsMobilePropertiesOpen}>
            <DialogContent className="fixed left-0 right-0 bottom-0 top-auto translate-x-0 translate-y-0 max-w-full rounded-t-3xl border-t p-6 shadow-2xl z-50 bg-card max-h-[80vh] overflow-y-auto custom-scrollbar">
              <DialogHeader className="border-b border-border/40 pb-2 mb-4">
                <DialogTitle className="text-lg font-bold text-foreground">Field Properties</DialogTitle>
              </DialogHeader>
              <FieldProperties />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <NoFormSelectedPlaceholder />
      )}
    </div>
  )
}