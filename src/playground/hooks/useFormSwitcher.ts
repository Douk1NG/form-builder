import { useState, useEffect } from 'react'
import { useFormBuilderStore } from '../store/useFormBuilderStore'

export function useFormSwitcher() {
    const formId = useFormBuilderStore((state) => state.formId)
    const formTitle = useFormBuilderStore((state) => state.formTitle)
    const savedForms = useFormBuilderStore((state) => state.savedForms)
    const switchForm = useFormBuilderStore((state) => state.switchForm)
    const createNewForm = useFormBuilderStore((state) => state.createNewForm)
    const updateFormTitle = useFormBuilderStore((state) => state.updateFormTitle)
    const deleteForm = useFormBuilderStore((state) => state.deleteForm)
    const isCreateFormDialogOpen = useFormBuilderStore((state) => state.isCreateFormDialogOpen)
    const setCreateFormDialogOpen = useFormBuilderStore((state) => state.setCreateFormDialogOpen)
    const isRenameFormDialogOpen = useFormBuilderStore((state) => state.isRenameFormDialogOpen)
    const setRenameFormDialogOpen = useFormBuilderStore((state) => state.setRenameFormDialogOpen)

    const hasSavedForms = Object.keys(savedForms).length > 0
    const hasActiveForm = Boolean(formId)
    const shouldShowInitialDialog = !hasSavedForms && !hasActiveForm

    const [newTitle, setNewTitle] = useState('')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editTitleValue, setEditTitleValue] = useState(formTitle)
    const [prevFormTitle, setPrevFormTitle] = useState(formTitle)

    if (formTitle !== prevFormTitle) {
        setEditTitleValue(formTitle)
        setPrevFormTitle(formTitle)
    }

    // Auto-open dialog on first load when no forms exist
    useEffect(() => {
        if (shouldShowInitialDialog) {
            setCreateFormDialogOpen(true)
        }
    }, [shouldShowInitialDialog, setCreateFormDialogOpen])

    // Auto-sync active form into savedForms list if it's missing (e.g., on first reload or legacy load)
    useEffect(() => {
        const currentSavedForms = useFormBuilderStore.getState().savedForms
        if (formId && !currentSavedForms[formId]) {
            useFormBuilderStore.setState((state) => ({
                savedForms: {
                    ...state.savedForms,
                    [formId]: {
                        formId,
                        formTitle,
                        formDescription: state.formDescription,
                        itemIds: state.itemIds,
                        itemsData: state.itemsData,
                    }
                }
            }))
        }
    }, [formId, formTitle])

    const handleCreate = () => {
        const trimmedTitle = newTitle.trim()
        if (trimmedTitle) {
            createNewForm(trimmedTitle)
            setCreateFormDialogOpen(false)
            setNewTitle('')
        }
    }

    const handleTitleSubmit = () => {
        const trimmedTitle = editTitleValue.trim()
        if (trimmedTitle) {
            updateFormTitle(trimmedTitle)
        } else {
            setEditTitleValue(formTitle)
        }
        setIsEditingTitle(false)
        setRenameFormDialogOpen(false)
    }

    const handleSelectChange = (selectedValue: string) => {
        switchForm(selectedValue)
    }

    const handleOpenDialog = () => {
        setCreateFormDialogOpen(true)
    }

    const handleOpenRenameDialog = () => {
        setEditTitleValue(formTitle)
        setRenameFormDialogOpen(true)
    }

    const handleDelete = (targetFormId: string) => {
        deleteForm(targetFormId)
    }

    const savedFormsList = Object.values(savedForms)
    const isCurrentFormUnsaved = Boolean(formId) && !savedFormsList.find((form) => form.formId === formId)

    return {
        formId,
        formTitle,
        savedFormsList,
        isCurrentFormUnsaved,
        isCreateFormDialogOpen,
        setCreateFormDialogOpen,
        isRenameFormDialogOpen,
        setRenameFormDialogOpen,
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
        handleOpenRenameDialog,
        handleDelete
    }
}