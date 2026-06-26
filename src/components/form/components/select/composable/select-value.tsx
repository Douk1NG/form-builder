"use client"

import { useSelectContext } from "./select-context"

type SelectValueProps = {
  options: Array<{ label: string; value: string }>
  placeholder?: string
}

export function SelectValue({ options, placeholder }: SelectValueProps) {
  const { value } = useSelectContext()
  const selected = options.find((opt) => opt.value === value)

  if (!selected) {
    return <span className="text-muted-foreground">{placeholder}</span>
  }

  return <span>{selected.label}</span>
}
