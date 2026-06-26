import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormSwitcherSelect } from './FormSwitcherSelect'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { useFormSwitcher } from '@/playground/hooks/useFormSwitcher'
import { useTranslation } from 'react-i18next'

export function FormSwitcher() {
    const {
        formId,
        formTitle,
        savedFormsList,
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
        handleOpenDialog,
        handleDelete
    } = useFormSwitcher()

    const { t: translations } = useTranslation('translation', {
        keyPrefix: 'playground.builder.header.formSwitcher'
    })

    return (
        <div className="flex items-center gap-3 ml-4">
            <FormSwitcherSelect
                value={formId}
                onValueChange={handleSelectChange}
                options={savedFormsList.map((form) => ({
                    value: form.formId,
                    label: form.formTitle
                }))}
                handleDeleteOption={handleDelete}
                handleCreateNew={handleOpenDialog}
            />
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