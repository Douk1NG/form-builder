import { useState } from 'react'
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

  const handleAddOption = () => {
    let nextNumber = options.length + 1
    while (options.some((option) => option.value === `option-${nextNumber}`)) {
      nextNumber++
    }
    const newOptions = [...options, { label: `Option ${nextNumber}`, value: `option-${nextNumber}` }]
    setOptions(newOptions)
    onChange(newOptions)
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, indexToRemove) => indexToRemove !== index)
    setOptions(newOptions)
    onChange(newOptions)
  }

  const handleUpdateOption = (index: number, propertyField: keyof Option, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [propertyField]: value }
    setOptions(newOptions)
    onChange(newOptions)
  }

  return {
    options,
    handleAddOption,
    handleRemoveOption,
    handleUpdateOption,
  }
}
