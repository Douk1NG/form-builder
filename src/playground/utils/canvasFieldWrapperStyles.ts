
const selectedStyles = 'border-primary/60 ring-2 ring-primary/15 shadow-md shadow-primary/5 bg-card/90'
const dragOverStyles = 'border-primary/40 border-t-4 shadow-sm bg-card/70'
const defaultStyles = 'border-border/40 hover:border-primary/30 shadow-xs bg-card/80 hover:shadow-sm'
export const draggingClassName = 'opacity-40 scale-[0.98] shadow-none border-dashed'

export const getBorderClass = (
    isSelected: boolean,
    isDragOver: boolean
) => {
    return isSelected
        ? selectedStyles
        : isDragOver
            ? dragOverStyles
            : defaultStyles
}