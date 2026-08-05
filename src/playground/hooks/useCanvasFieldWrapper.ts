import { getBorderClass, draggingClassName } from "@/playground/utils/canvasFieldWrapperStyles"

type useCanvasFieldWrapperParameters = {
    isSelected: boolean
    isDragOver: boolean
    isDragging: boolean
}

const useCanvasFieldWrapper = ({
    isSelected,
    isDragOver,
    isDragging
}: useCanvasFieldWrapperParameters) => {
    const borderClass = getBorderClass(isSelected, isDragOver)
    const draggingClassNameValue = isDragging ? draggingClassName : ''

    const handleOnKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>,
        onSelect: () => void
    ) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onSelect()
        }
    }

    return {
        borderClass,
        draggingClassName: draggingClassNameValue,
        handleOnKeyDown
    }
}

export { useCanvasFieldWrapper }