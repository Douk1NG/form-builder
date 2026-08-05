import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types'

export type EdgeIndicatorsProps = {
    closestEdge: Edge | null
    borderRadius?: 'xl' | '2xl'
}

export function EdgeIndicators({ closestEdge, borderRadius = 'xl' }: EdgeIndicatorsProps) {
    const roundedLeft = borderRadius === '2xl' ? 'rounded-l-2xl' : 'rounded-l-xl'
    const roundedRight = borderRadius === '2xl' ? 'rounded-r-2xl' : 'rounded-r-xl'
    const roundedTop = borderRadius === '2xl' ? 'rounded-t-2xl' : 'rounded-t-xl'
    const roundedBottom = borderRadius === '2xl' ? 'rounded-b-2xl' : 'rounded-b-xl'

    return (
        <>
            {closestEdge === 'left' && (
                <div className={`absolute top-0 bottom-0 left-0 w-2 bg-primary ${roundedLeft} z-20 pointer-events-none`} />
            )}
            {closestEdge === 'right' && (
                <div className={`absolute top-0 bottom-0 right-0 w-2 bg-primary ${roundedRight} z-20 pointer-events-none`} />
            )}
            {closestEdge === 'top' && (
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-primary ${roundedTop} z-20 pointer-events-none`} />
            )}
            {closestEdge === 'bottom' && (
                <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-primary ${roundedBottom} z-20 pointer-events-none`} />
            )}
        </>
    )
}
