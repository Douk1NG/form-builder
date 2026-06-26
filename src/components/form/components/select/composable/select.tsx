"use client"

import { SelectProvider } from "./select-context"
import { useSelectState } from "./use-select-state"

type SelectProps = {
  value?: string | null
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

export function Select({
  value: controlledValue = null,
  onValueChange,
  children
}: SelectProps) {
  const {
    open,
    setOpen,
    rootRef
  } = useSelectState()

  return (
    <SelectProvider
      open={open}
      setOpen={setOpen}
      value={controlledValue}
      onValueChange={onValueChange ?? (() => { })}
      rootRef={rootRef}
    >
      <div ref={rootRef} className="relative w-full min-w-64">
        {children}
      </div>
    </SelectProvider>
  )
}
