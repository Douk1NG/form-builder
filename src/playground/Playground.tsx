import { AmbientBackground } from './components/AmbientBackground'
import { FieldPalette } from './components/FieldPalette/FieldPalette'
import { FieldProperties } from './components/FieldProperties/FieldProperties'
import { FormCanvas } from './components/FormCanvas/FormCanvas'
import { PlaygroundHeader } from './components/PlaygroundHeader/PlaygroundHeader'
import { usePlaygroundLayout } from './hooks/usePlaygroundLayout'
import { NoFormSelectedPlaceholder } from './components/NoFormSelectedPlaceholder'

export function Playground() {
  const { formId, propertiesSidebarWidth } = usePlaygroundLayout()

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      <AmbientBackground />
      <PlaygroundHeader />

      {formId ? (
        <div className="flex flex-1 overflow-hidden relative z-10">
          <aside className="w-64 p-4 overflow-y-auto border-r bg-card/80 backdrop-blur-xl border-border/50 shadow-[2px_0_20px_rgba(0,0,0,0.03)] z-10">
            <FieldPalette />
          </aside>

          <main className="flex-1 p-8 overflow-y-auto bg-transparent relative custom-scrollbar">
            <FormCanvas />
          </main>

          <aside className={`${propertiesSidebarWidth} p-4 overflow-y-auto border-l bg-card/80 backdrop-blur-xl border-border/50 shadow-[-2px_0_20px_rgba(0,0,0,0.03)] z-10 transition-[width] duration-300 ease-in-out`}>
            <FieldProperties />
          </aside>
        </div>
      ) : (
        <NoFormSelectedPlaceholder />
      )}
    </div>
  )
}