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

    const hasSavedForms = Object.keys(savedForms).length > 0
    const hasActiveForm = Boolean(formId)
    const shouldShowInitialDialog = !hasSavedForms && !hasActiveForm

    const [isDialogOpen, setIsDialogOpen] = useState(shouldShowInitialDialog)
    const [newTitle, setNewTitle] = useState('')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editTitleValue, setEditTitleValue] = useState(formTitle)
    const [prevFormTitle, setPrevFormTitle] = useState(formTitle)

    if (formTitle !== prevFormTitle) {
        setEditTitleValue(formTitle)
        setPrevFormTitle(formTitle)
    }

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
            setIsDialogOpen(false)
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
    }

    const handleSelectChange = (selectedValue: string) => {
        switchForm(selectedValue)
        return
    }

    const handleOpenDialog = () => {
        setIsDialogOpen(true)
        return
    }

    const handleDelete = (targetFormId: string) => {
        deleteForm(targetFormId)
        return
    }

    const savedFormsList = Object.values(savedForms)
    const isCurrentFormUnsaved = Boolean(formId) && !savedFormsList.find((form) => form.formId === formId)

    return {
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
        handleOpenDialog,
        handleDelete
    }
}