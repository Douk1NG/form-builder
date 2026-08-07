import { FieldRenderer } from '@/playground/components/FormCanvas/FieldRenderer/FieldRenderer'
import { FieldGroupRenderer } from '@/playground/components/FormCanvas/FieldGroupRenderer/FieldGroupRenderer'
import type { CanvasItem } from '@/types/form'
import { ITEM_KINDS } from '@/types/itemKinds'

export type CanvasItemRendererProps = {
    item: CanvasItem
    index: number
}

export function CanvasItemRenderer({ item, index }: CanvasItemRendererProps) {
    const { kind, id } = item
    const isField = kind === ITEM_KINDS.FIELD
    const isGroup = kind === ITEM_KINDS.FIELD_GROUP

    if (isField) {
        return <FieldRenderer id={id} index={index} />
    }
    if (isGroup) {
        return <FieldGroupRenderer groupId={id} index={index} />
    }
    return null
}