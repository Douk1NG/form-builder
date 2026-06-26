"use client"

import type { SelectContextType } from "./selectType"

import {
  createContext,
  useContext
} from "react"

const SelectContext = createContext<SelectContextType | undefined>(undefined)

export function useSelectContext() {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error("useSelectContext must be used within a Select component")
  }
  return context
}

export function SelectProvider({
  children,
  open,
  setOpen,
  value,
  onValueChange,
  rootRef,
}: SelectContextType & { children: React.ReactNode }) {
  return (
    <SelectContext.Provider value={{
      open,
      setOpen,
      value,
      onValueChange,
      rootRef
    }}>
      {children}
    </SelectContext.Provider>
  )
}
