import { Button } from '../../components/ui/button'
import { Eye, Pencil, Download, Blocks } from 'lucide-react'
import { usePlayground } from '../hooks/usePlayground'

function FormBuilderLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-lg bg-primary/10">
        <Blocks className="w-5 h-5 text-primary" />
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">
        Form Builder
      </span>
    </div>
  )
}

function EditingBadge({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 ml-3 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-sm text-muted-foreground font-medium">
        Editing: <span className="text-foreground">{title}</span>
      </span>
    </div>
  )
}

export function PlaygroundHeader() {
  const {
    formId,
    formTitle,
    previewMode,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  return (
    <header className="px-6 py-3 border-b bg-card/80 backdrop-blur-xl border-border/50 shadow-xs sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FormBuilderLogo />
          {formId && <EditingBadge title={formTitle} />}
        </div>

        <div className="flex items-center gap-2">
          {formId && (
            <>
              <Button
                variant={previewMode ? 'default' : 'outline'}
                size="sm"
                onClick={handleTogglePreview}
                className="transition-all duration-200 rounded-lg gap-2"
              >
                {previewMode ? (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportJson}
                className="transition-all duration-200 hover:bg-primary/5 rounded-lg gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
