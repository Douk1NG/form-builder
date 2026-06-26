"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSelectContext } from "./select-context"

type SelectTriggerProps = {
  placeholder?: string
  className?: string
  children?: React.ReactNode
}

export function SelectTrigger({ placeholder = "Select an option", className, children }: SelectTriggerProps) {
  const { open, setOpen } = useSelectContext()

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex w-full items-center justify-between rounded-md border border-input",
        "bg-background px-3 py-2 text-sm",
        "outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <div className="flex-1">
        {children || <span className="text-muted-foreground">{placeholder}</span>}
      </div>
      <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
    </button>
  )
}
