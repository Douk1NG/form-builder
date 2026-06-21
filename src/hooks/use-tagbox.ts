import { useState, useCallback } from 'react'
import type { Tag } from '../types/tagbox'

export const useTagbox = (
    initialTags: Tag[] = [], 
    onError?: (error: string) => void,
    translate: (key: string) => string = (key) => key
) => {
    const [tags, setTags] = useState<Tag[]>(initialTags)
    const [inputValue, setInputValue] = useState('')

    const isTagExists = useCallback((value: string) => {
        return tags.some(tag => tag.label.toLowerCase() === value.toLowerCase())
    }, [tags])

    const createNewTag = useCallback((value: string): Tag => ({
        value: Date.now().toString(),
        label: value.trim()
    }), [])

    const showDuplicateError = useCallback(() => {
        onError?.(translate('layout.form.tagbox.validation.unique.description'))
    }, [onError, translate])

    const addTag = useCallback(() => {
        const trimmedValue = inputValue.trim()
        const isEmpty = trimmedValue === ''

        if (isEmpty) return

        if (isTagExists(trimmedValue)) {
            showDuplicateError()
            return
        }

        setTags(prevTags => [...prevTags, createNewTag(trimmedValue)])
        setInputValue('')
    }, [inputValue, isTagExists, createNewTag, showDuplicateError])

    const removeTag = useCallback((label: string) => {
        setTags(prevTags => prevTags.filter(tag => tag.label !== label))
    }, [])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addTag()
        }
    }, [addTag])

    return {
        tags,
        inputValue,
        isInputEmpty: !inputValue.trim(),
        handleInputChange,
        handleKeyDown,
        addTag,
        removeTag
    }
}
