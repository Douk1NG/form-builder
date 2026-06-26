"use client"

import { cn } from "@/lib/utils"

type SelectSeparatorProps = {
  className?: string
}

export function SelectSeparator({ className }: SelectSeparatorProps) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} role="separator" aria-hidden="true" />
}
