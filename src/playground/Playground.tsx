import { usePlayground } from './hooks/usePlayground'
import { FieldPalette } from './components/FieldPalette'
import { FormCanvas } from './components/FormCanvas'
import { FieldProperties } from './components/FieldProperties'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Eye, Download, Plus } from 'lucide-react'

export function Playground() {
  const {
    currentForm,
    previewMode,
    newTitle,
    handleTitleChange,
    handleCreate,
    handleKeyDown,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="px-6 py-4 border-b bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Form Builder Playground</h1>
            {currentForm && (
              <span className="text-sm font-medium text-muted-foreground">
                Editing: {currentForm.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!currentForm ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Form title..."
                  value={newTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleCreate} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Form
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant={previewMode ? "default" : "outline"} 
                  size="sm" 
                  onClick={handleTogglePreview}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit Mode' : 'Preview'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJson}>
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {currentForm ? (
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 p-4 overflow-y-auto border-r bg-card border-border">
            <FieldPalette />
          </aside>
          
          <main className="flex-1 p-8 overflow-y-auto bg-muted/30">
            <FormCanvas />
          </main>
          
          <aside className="w-80 p-4 overflow-y-auto border-l bg-card border-border">
            <FieldProperties />
          </aside>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 text-muted-foreground">
          Create a form to get started
        </div>
      )}
    </div>
  )
}
