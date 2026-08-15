"use client"

import { cn } from "@/lib/utils"
import { useSelectContext } from "./select-context"

type SelectContentProps = {
  className?: string
  children: React.ReactNode
}

export function SelectContent({ className, children }: SelectContentProps) {
  const { open } = useSelectContext()

  if (!open) return null

  return (
    <div
      role="listbox"
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "absolute top-full left-0 right-0 z-50 mt-2 rounded-md border border-input",
        "bg-popover shadow-md",
        className,
      )}
    >
      <ul className="max-h-60 overflow-y-auto p-1 group">{children}</ul>
    </div>
  )
}
