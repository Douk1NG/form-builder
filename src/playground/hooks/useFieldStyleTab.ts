import type { FieldStyle, GroupStyle } from '@/types/form'

type UseFieldStyleTabParameters = {
  fieldStyle: FieldStyle | undefined
  onFieldStyleChange: (style: FieldStyle) => void
  groupStyle: GroupStyle | undefined
  onGroupStyleChange: (style: GroupStyle) => void
}

export function useFieldStyleTab({
  fieldStyle = {},
  onFieldStyleChange,
  groupStyle = {},
  onGroupStyleChange
}: UseFieldStyleTabParameters) {

  const updateFieldStyle = (key: keyof FieldStyle, value: string) => {
    onFieldStyleChange({
      ...fieldStyle,
      [key]: value === 'none' ? undefined : value
    })
  }

  const updateGroupStyle = (key: keyof GroupStyle, value: string) => {
    onGroupStyleChange({
      ...groupStyle,
      [key]: value === 'none' ? undefined : value
    })
  }

  return {
    updateFieldStyle,
    updateGroupStyle
  }
}
