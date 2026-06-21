import { Button } from '../../components/ui/button'
import { Eye, Download } from 'lucide-react'
import { usePlayground } from '../hooks/usePlayground'

export function PlaygroundHeader() {
  const {
    formId,
    formTitle,
    previewMode,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  return (
    <header className="px-6 py-4 border-b bg-card border-border shadow-sm backdrop-blur-md bg-opacity-90 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Form Builder
          </h1>
          {formId && (
            <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Editing: <span className="text-foreground">{formTitle}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {formId && (
            <>
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={handleTogglePreview}
                className="transition-all"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportJson} className="transition-all hover:bg-primary/5">
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
