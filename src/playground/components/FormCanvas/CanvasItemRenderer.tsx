import { FieldRenderer } from '@/playground/components/FormCanvas/FieldRenderer/FieldRenderer'
import { FieldGroupRenderer } from '@/playground/components/FormCanvas/FieldGroupRenderer/FieldGroupRenderer'
import type { CanvasItem } from '@/types/form'

export type CanvasItemRendererProps = {
    item: CanvasItem
    index: number
}

export function CanvasItemRenderer({ item, index }: CanvasItemRendererProps) {
    const { kind, id } = item
    const isField = kind === 'field'
    const isGroup = kind === 'field_group'

    if (isField) {
        return <FieldRenderer id={id} index={index} />
    }
    if (isGroup) {
        return <FieldGroupRenderer groupId={id} index={index} />
    }
    return null
}