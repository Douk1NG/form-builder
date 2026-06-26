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

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [editTitleValue, setEditTitleValue] = useState(formTitle)

    useEffect(() => {
        setEditTitleValue(formTitle)
    }, [formTitle])

    //code needs review, saved form is always 0 until I create a new and suddenly appers 2, plus new I create a new one the last is being erased
    useEffect(() => {
        const savedFormsList = Object.values(savedForms)
        if (savedFormsList.length === 0 && !isDialogOpen) {
            // only exec 1, if the user close the dialog then it won't open again.
            // This logic is flawed, when the user closes the dialog it will still open again due to state change
            setIsDialogOpen(true)
            return
        }
    }, [savedForms])

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

    // I have to delete twice.. 1st call is not deleting at all, probably has a corelation with prev bug reported
    const handleDelete = (targetFormId: string) => {
        deleteForm(targetFormId)
        //should I switch form after delete?
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