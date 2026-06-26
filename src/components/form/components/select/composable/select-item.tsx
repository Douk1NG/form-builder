"use client"

import { cn } from "@/lib/utils"
import { useSelectContext } from "./select-context"
import { ChevronRight } from "lucide-react"

type SelectItemProps = {
  value: string
  label: string
  children?: React.ReactNode
  className?: string
}

export function SelectItem({ value, label, children, className }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext()
  const isSelected = value === selectedValue

  return (
    <li className="group">
      <div className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 hover:bg-accent transition-colors",
        isSelected && "bg-accent rounded-md p-2 font-medium group-hover:bg-transparent hover:bg-accent!",
        className
      )}>
        <button
          type="button"
          role="option"
          aria-selected={isSelected}
          onClick={() => {
            onValueChange(value)
            setOpen(false)
          }}
          className={cn(
            "flex flex-1 items-center gap-2 text-left text-sm",
            "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          {isSelected && <ChevronRight className="h-4 w-4" />}
          {label}
        </button>
        {children}
      </div>
    </li>
  )
}
