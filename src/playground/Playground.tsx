import { usePlayground } from './hooks/usePlayground'
import { PlaygroundHeader } from './components/PlaygroundHeader'
import { FieldPalette } from './components/FieldPalette'
import { FormCanvas } from './components/FormCanvas'
import { FieldProperties } from './components/FieldProperties'

import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'

export function Playground() {
  const {
    formId,
    newTitle,
    handleTitleChange,
    handleCreate,
    handleKeyDown
  } = usePlayground()

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-background via-background to-muted/50 text-foreground overflow-hidden">
      <PlaygroundHeader />

      {formId ? (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Sidebar */}
          <aside className="w-72 p-6 overflow-y-auto border-r bg-card/60 backdrop-blur-xl border-border/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all">
            <FieldPalette />
          </aside>

          {/* Main Canvas Area */}
          <main className="flex-1 p-8 overflow-y-auto bg-transparent relative">
            <FormCanvas />
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 p-6 overflow-y-auto border-l bg-card/60 backdrop-blur-xl border-border/50 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all">
            <FieldProperties />
          </aside>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground bg-transparent p-4">
          <div className="p-10 border rounded-3xl bg-card/50 backdrop-blur-xl shadow-2xl border-border/50 max-w-lg text-center transform transition-all w-full">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3 text-foreground tracking-tight">Create a Form</h2>
            <p className="text-lg opacity-80 mb-8">Enter a title to start building your custom layout.</p>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <Input
                autoFocus
                placeholder="E.g. Customer Feedback Survey"
                value={newTitle}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                className="text-lg py-6 px-4 transition-all focus:ring-primary shadow-inner bg-background/50"
              />
              <Button onClick={handleCreate} size="lg" className="w-full text-md shadow-md hover:shadow-lg transition-all py-6">
                Start Building
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
