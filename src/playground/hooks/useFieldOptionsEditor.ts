import { useState, useEffect, useRef } from 'react'
import type { Option } from '../../types/select'

export function useFieldOptionsEditor(
  initialOptions: Option[] = [],
  onChange: (options: Option[]) => void
) {
  const [options, setOptions] = useState<Option[]>(initialOptions)
  const [prevInitialOptions, setPrevInitialOptions] = useState<Option[]>(initialOptions)

  if (initialOptions !== prevInitialOptions) {
    setOptions(initialOptions)
    setPrevInitialOptions(initialOptions)
  }

  const onChangeRef = useRef(onChange)
  
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const triggerChange = (newOptions: Option[]) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    onChangeRef.current(newOptions)
  }

  const triggerChangeDebounced = (newOptions: Option[]) => {
    setOptions(newOptions)
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      onChangeRef.current(newOptions)
    }, 150)
  }

  const handleAddOption = () => {
    const usedValues = new Set(options.map((option) => option.value))
    let nextNumber = 1
    while (usedValues.has(`option-${nextNumber}`)) {
      nextNumber++
    }
    const newOptions = [...options, { label: `Option ${nextNumber}`, value: `option-${nextNumber}` }]
    setOptions(newOptions)
    triggerChange(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, indexToRemove) => indexToRemove !== index)
    setOptions(newOptions)
    triggerChange(newOptions)
  }

  const handleUpdateOption = (index: number, propertyField: keyof Option, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [propertyField]: value }
    triggerChangeDebounced(newOptions)
  }

  const handleBlur = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      onChangeRef.current(options)
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    options,
    handleAddOption,
    handleRemoveOption,
    handleUpdateOption,
    handleBlur,
  }
}

