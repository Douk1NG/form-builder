import { usePlayground } from './hooks/usePlayground'
import { PlaygroundHeader } from './components/PlaygroundHeader'
import { FieldPalette } from './components/FieldPalette'
import { FormCanvas } from './components/FormCanvas'
import { FieldProperties } from './components/FieldProperties'
import { AmbientBackground } from './components/AmbientBackground'
import { CreateFormPrompt } from './components/CreateFormPrompt'
import { useFormBuilderStore } from './store/useFormBuilderStore'

export function Playground() {
  const {
    formId,
    newTitle,
    handleTitleChange,
    handleCreate,
    handleKeyDown
  } = usePlayground()

  const hasSelectedItem = useFormBuilderStore((state) => state.selectedItemId !== null)
  const isPropertiesExpanded = useFormBuilderStore((state) => state.isPropertiesExpanded)

  const propertiesSidebarWidth = !hasSelectedItem 
    ? 'w-80' 
    : isPropertiesExpanded 
      ? 'w-1/2' 
      : 'w-80'

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      <AmbientBackground />
      <PlaygroundHeader />

      {formId ? (
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Left Sidebar */}
          <aside className="w-64 p-4 overflow-y-auto border-r bg-card/80 backdrop-blur-xl border-border/50 shadow-[2px_0_20px_rgba(0,0,0,0.03)] z-10">
            <FieldPalette />
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 p-8 overflow-y-auto bg-transparent relative">
            <FormCanvas />
          </main>

          {/* Right Sidebar */}
          <aside className={`${propertiesSidebarWidth} p-4 overflow-y-auto border-l bg-card/80 backdrop-blur-xl border-border/50 shadow-[-2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-[width] duration-300 ease-in-out`}>
            <FieldProperties />
          </aside>
        </div>
      ) : (
        <CreateFormPrompt
          newTitle={newTitle}
          onTitleChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

