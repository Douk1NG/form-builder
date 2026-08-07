import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types'
import type { FieldType } from '@/types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export type PaletteDragData = {
    source: 'palette'
    type: FieldType | typeof ITEM_KINDS.FIELD_GROUP | typeof ITEM_KINDS.COLUMN_ROW
    label: string
}

export type CanvasDragData = {
    source: 'canvas'
    id: string
    index: number
}

export type DragSourceData = PaletteDragData | CanvasDragData

export type CanvasDropData = {
    isCanvas?: boolean
    id?: string
    index?: number
    insertIndex?: number
    groupId?: string
    closestEdge?: Edge | null
}

export function isPaletteDragData(data: Record<string, unknown>): data is PaletteDragData {
    return data.source === 'palette'
}

export function isCanvasDragData(data: Record<string, unknown>): data is CanvasDragData {
    return data.source === 'canvas'
}