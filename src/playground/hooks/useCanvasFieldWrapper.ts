import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types"
import { LEFT, RIGHT, TOP, BOTTOM } from "@/playground/constants/edgeConstants"
import { getBorderClass, draggingClassName } from "@/playground/utils/canvasFieldWrapperStyles"

type useCanvasFieldWrapperParameters = {
    closestEdge: Edge | null
    isSelected: boolean
    isDragOver: boolean
    isDragging: boolean
}

const useCanvasFieldWrapper = ({
    closestEdge,
    isSelected,
    isDragOver,
    isDragging
}: useCanvasFieldWrapperParameters) => {
    const isLeftEdge = closestEdge === LEFT
    const isRightEdge = closestEdge === RIGHT
    const isTopEdge = closestEdge === TOP
    const isBottomEdge = closestEdge === BOTTOM

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
        isLeftEdge,
        isRightEdge,
        isTopEdge,
        isBottomEdge,
        borderClass,
        draggingClassName: draggingClassNameValue,
        handleOnKeyDown
    }
}

export { useCanvasFieldWrapper }