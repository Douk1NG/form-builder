export type SelectOption = {
  label: string
  value: string
}

export type SelectContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  value: string | null
  onValueChange: (value: string) => void
  rootRef: React.RefObject<HTMLDivElement | null>
}
