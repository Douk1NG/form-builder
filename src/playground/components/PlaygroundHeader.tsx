import { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Eye, Pencil, Download, Blocks, Languages, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePlayground } from '../hooks/usePlayground'
import { useFormBuilderStore } from '../store/useFormBuilderStore'
import { SUPPORTED_LOCALES } from '../../utils/locales'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'

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

function FormSwitcher() {
  const formId = useFormBuilderStore((state) => state.formId)
  const formTitle = useFormBuilderStore((state) => state.formTitle)
  const savedForms = useFormBuilderStore((state) => state.savedForms)
  const switchForm = useFormBuilderStore((state) => state.switchForm)
  const createNewForm = useFormBuilderStore((state) => state.createNewForm)
  const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitleValue, setEditTitleValue] = useState(formTitle)

  useEffect(() => {
    setEditTitleValue(formTitle)
  }, [formTitle])

  const handleCreate = () => {
    if (newTitle.trim()) {
      createNewForm(newTitle.trim())
      setIsDialogOpen(false)
      setNewTitle('')
    }
  }

  const handleTitleSubmit = () => {
    if (editTitleValue.trim()) {
      updateFormTitle(editTitleValue.trim())
    } else {
      setEditTitleValue(formTitle)
    }
    setIsEditingTitle(false)
  }

  const savedFormsList = Object.values(savedForms)

  return (
    <div className="flex items-center gap-3 ml-4">
      <Select value={formId || ''} onValueChange={(val) => {
        if (val === 'new_form') {
          setIsDialogOpen(true)
        } else {
          switchForm(val)
        }
      }}>
        <SelectTrigger className="w-50 h-8 text-sm font-medium bg-muted/30 border-border/50">
          <SelectValue placeholder="Select a form..." />
        </SelectTrigger>
        <SelectContent>
          {savedFormsList.map((form) => (
            <SelectItem key={form.formId} value={form.formId}>
              {form.formTitle}
            </SelectItem>
          ))}
          {(!savedFormsList.find(f => f.formId === formId) && formId) && (
            <SelectItem key={formId} value={formId}>
              {formTitle}
            </SelectItem>
          )}
          <SelectSeparator />
          <SelectItem value="new_form" className="font-semibold text-primary">
            + Create New Form
          </SelectItem>
        </SelectContent>
      </Select>

      {formId && (
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <Input
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="h-8 w-48 text-sm"
              autoFocus
            />
          ) : (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50 cursor-pointer hover:bg-muted/80 transition-colors group"
              onClick={() => setIsEditingTitle(true)}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span className="text-foreground">{formTitle}</span>
                <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>Enter a name for your new form.</DialogDescription>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. User Survey"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LocaleSwitcher() {
  const { i18n } = useTranslation()
  const previewLocale = useFormBuilderStore((state) => state.previewLocale)
  const setPreviewLocale = useFormBuilderStore((state) => state.setPreviewLocale)

  const currentIndex = SUPPORTED_LOCALES.indexOf(previewLocale as typeof SUPPORTED_LOCALES[number])
  const nextIndex = (currentIndex + 1) % SUPPORTED_LOCALES.length
  const nextLocale = SUPPORTED_LOCALES[nextIndex]

  const handleToggleLocale = () => {
    setPreviewLocale(nextLocale)
    i18n.changeLanguage(nextLocale)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggleLocale}
      className="font-semibold gap-1.5 rounded-lg transition-all duration-200"
    >
      <Languages className="w-3.5 h-3.5" />
      {previewLocale.toUpperCase()}
    </Button>
  )
}

export function PlaygroundHeader() {
  const {
    formId,
    previewMode,
    handleTogglePreview,
    handleExportJson,
  } = usePlayground()

  const previewDevice = useFormBuilderStore((state) => state.previewDevice)
  const setPreviewDevice = useFormBuilderStore((state) => state.setPreviewDevice)

  return (
    <header className="px-6 py-3 border-b bg-card/80 backdrop-blur-xl border-border/50 shadow-xs sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FormBuilderLogo />
          <FormSwitcher />
        </div>

        <div className="flex items-center gap-2">
          {formId && previewMode && (
            <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border/50 mr-2">
              <Button
                variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('desktop')}
                className="h-7 w-8 px-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('tablet')}
                className="h-7 w-8 px-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setPreviewDevice('mobile')}
                className="h-7 w-8 px-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          )}
          <LocaleSwitcher />
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

