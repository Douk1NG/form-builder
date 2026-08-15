"use client"

import { cn } from "@/lib/utils"
import { useSelectContext } from "./select-context"

type SelectActionsProps = {
  children: React.ReactNode
  className?: string
}

export function SelectActions({ children, className }: SelectActionsProps) {
  return (
    <div className={cn("flex flex-col gap-1 p-1", className)}>
      {children}
    </div>
  )
}

type SelectActionButtonProps = {
  onClick: () => void
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function SelectActionButton({
  onClick,
  children,
  icon,
  className,
}: SelectActionButtonProps) {
  const { setOpen } = useSelectContext()

  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => {
        onClick()
        setOpen(false)
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm",
        "outline-none transition-colors hover:bg-accent focus-visible:bg-accent",
        className,
      )}
    >
      <span className="truncate font-medium">{children}</span>
      {icon}
    </button>
  )
}
