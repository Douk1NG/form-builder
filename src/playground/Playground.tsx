import { AmbientBackground } from './components/AmbientBackground'
import { FieldPalette } from './components/FieldPalette/FieldPalette'
import { FieldProperties } from './components/FieldProperties/FieldProperties'
import { FormCanvas } from './components/FormCanvas/FormCanvas'
import { PlaygroundHeader } from './components/PlaygroundHeader/PlaygroundHeader'
import { usePlaygroundLayout } from './hooks/usePlaygroundLayout'
import { NoFormSelectedPlaceholder } from './components/NoFormSelectedPlaceholder'
import { ChevronLeft, ChevronRight, Layout, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIsMobile } from './hooks/useIsMobile'
import { useFormBuilderStore } from './store/useFormBuilderStore'
import { MobilePreviewContent } from './components/FormCanvas/MobilePreviewContent'
import { MobilePaletteHud } from './components/FieldPalette/MobilePaletteHud'
import { MobilePropertiesHud } from './components/FieldProperties/MobilePropertiesHud'

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
  } = usePlaygroundLayout()

  const setPreviewMode = useFormBuilderStore((state) => state.setPreviewMode)
  const isMobile = useIsMobile()

  const tabButtonStyles = 'flex flex-col items-center justify-center flex-1 py-1 gap-1 text-xs font-medium transition-colors'
  const activeColorClass = 'text-primary'
  const inactiveColorClass = 'text-muted-foreground hover:text-foreground'

  const renderMobileLayout = () => {
    return (
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <main className="flex-1 p-4 pb-20 overflow-y-auto bg-transparent relative custom-scrollbar">
          {!previewMode && (
            <>
              <FormCanvas />
              <MobilePaletteHud />
              <MobilePropertiesHud />
            </>
          )}
          {previewMode && <MobilePreviewContent />}
        </main>

        {/* Sticky Mobile Navigation Bottom Tab Bar */}
        <div className="fixed bottom-0 inset-x-0 h-16 bg-card/85 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-around px-4">
          <button
            onClick={() => setPreviewMode(false)}
            className={`${tabButtonStyles} ${
              !previewMode ? activeColorClass : inactiveColorClass
            }`}
          >
            <Layout className="w-5 h-5" />
            <span>Canvas</span>
          </button>

          <button
            onClick={() => setPreviewMode(true)}
            className={`${tabButtonStyles} ${
              previewMode ? activeColorClass : inactiveColorClass
            }`}
          >
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </button>
        </div>
      </div>
    )
  }

  const isMobileLayoutActive = formId && isMobile

  const desktopWorkspace = (
    <div className="flex flex-1 overflow-hidden relative z-10">
      {/* Left Palette Sidebar */}
      {!previewMode && (
        <aside className={`flex relative flex-col h-full bg-card/80 backdrop-blur-xl border-r border-border/50 shadow-[2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-all duration-300 ease-in-out ${paletteSidebarWidth} ${isPaletteCollapsed ? '' : 'p-4 overflow-y-auto'}`}>
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
          className="flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full shadow-md bg-card/90 backdrop-blur-md hover:bg-muted border border-border/60 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </Button>
      )}

      {/* Main workspace */}
      <main className="flex-1 p-8 overflow-y-auto bg-transparent relative custom-scrollbar">
        <FormCanvas />
      </main>

      {/* Right Properties Sidebar */}
      {!previewMode && (
        <aside className={`flex relative flex-col h-full bg-card/80 backdrop-blur-xl border-l border-border/50 shadow-[-2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-all duration-300 ease-in-out ${propertiesSidebarWidth} ${isPropertiesCollapsed ? '' : 'p-4 overflow-y-auto'}`}>
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
          className="flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full shadow-md bg-card/90 backdrop-blur-md hover:bg-muted border border-border/60 transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </Button>
      )}
    </div>
  )

  const renderContent = () => {
    if (!formId) {
      return <NoFormSelectedPlaceholder />
    }
    if (isMobileLayoutActive) {
      return renderMobileLayout()
    }
    return desktopWorkspace
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      <AmbientBackground />
      <PlaygroundHeader />
      {renderContent()}
    </div>
  )
}