import { Pencil } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from '../../components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { useFormSwitcher } from '../hooks/useFormSwitcher'
import { useTranslation } from 'react-i18next'

export function FormSwitcher() {
    const {
        formId,
        formTitle,
        savedFormsList,
        isCurrentFormUnsaved,
        isDialogOpen,
        setIsDialogOpen,
        newTitle,
        setNewTitle,
        isEditingTitle,
        setIsEditingTitle,
        editTitleValue,
        setEditTitleValue,
        handleCreate,
        handleTitleSubmit,
        handleSelectChange,
    } = useFormSwitcher()

    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.builder.header.formSwitcher'
    })

    return (
        <div className="flex items-center gap-3 ml-4">
            <Select
                value={formId || ''}
                onValueChange={handleSelectChange}
            >
                <SelectTrigger className="w-48 h-8 text-sm font-medium bg-muted/30 border-border/50">
                    <SelectValue placeholder={translations('placeholder')} />
                </SelectTrigger>
                <SelectContent>
                    {savedFormsList.map((form) => (
                        <SelectItem key={form.formId} value={form.formId}>
                            {form.formTitle}
                        </SelectItem>
                    ))}
                    {isCurrentFormUnsaved && formId && (
                        <SelectItem key={formId} value={formId}>
                            {formTitle}
                        </SelectItem>
                    )}
                    <SelectSeparator />
                    <SelectItem
                        value="new_form"
                        className="font-semibold text-primary"
                    >
                        {translations('create')}
                    </SelectItem>
                </SelectContent>
            </Select>

            {formId && (
                <div className="flex items-center gap-2">
                    {isEditingTitle ? (
                        <Input
                            value={editTitleValue}
                            onChange={(event) => setEditTitleValue(event.target.value)}
                            onBlur={handleTitleSubmit}
                            onKeyDown={(event) => event.key === 'Enter' && handleTitleSubmit()}
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

            <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {translations('dialog.title')}
                        </DialogTitle>
                        <DialogDescription>
                            {translations('dialog.description')}
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        placeholder={translations('dialog.inputPlaceholder')}
                        onKeyDown={(event) => event.key === 'Enter' && handleCreate()}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            {translations('dialog.cancel')}
                        </Button>
                        <Button onClick={handleCreate}>
                            {translations('dialog.create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}