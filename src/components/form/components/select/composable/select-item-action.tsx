"use client"

import { cn } from "@/lib/utils"

type SelectItemActionProps = {
  icon: React.ReactNode
  onClick: (e: React.MouseEvent) => void
  label?: string
  className?: string
  variant?: "default" | "destructive"
}

export function SelectItemAction({
  icon,
  onClick,
  label,
  className,
  variant = "default",
}: SelectItemActionProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        "p-1 shrink-0",
        variant === "default" && "text-muted-foreground hover:text-foreground",
        variant === "destructive" && "text-muted-foreground hover:text-destructive",
        className,
      )}
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}
