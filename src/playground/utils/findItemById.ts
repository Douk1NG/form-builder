import type { CanvasItem } from '../../types/form'

export function findItemById(items: Record<string, CanvasItem>, itemId: string): CanvasItem | null {
    for (const item of Object.values(items)) {
        if (item.id === itemId) return item

        if (item.kind === 'field_group') {
            const nestedItems = Object.fromEntries(item.items.map((child) => [child.id, child]))
            const nestedMatch = findItemById(nestedItems, itemId)
            if (nestedMatch) return nestedMatch
        }
    }

    return null
}