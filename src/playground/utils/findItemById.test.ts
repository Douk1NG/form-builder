import { describe, it, expect } from 'vitest'
import type { CanvasItem } from '../../types/form'
import { findItemById, isDescendantOrSelf } from './findItemById'

describe('findItemById', () => {
    const itemsData: Record<string, CanvasItem> = {
        'field-1': {
            id: 'field-1',
            kind: 'field',
            type: 'text',
            label: 'Field 1',
            name: 'field_1',
        },
        'group-1': {
            id: 'group-1',
            kind: 'field_group',
            label: 'Group 1',
            items: [
                {
                    id: 'field-2',
                    kind: 'field',
                    type: 'number',
                    label: 'Field 2',
                    name: 'field_2',
                },
                {
                    id: 'group-2',
                    kind: 'field_group',
                    label: 'Group 2',
                    items: [
                        {
                            id: 'field-3',
                            kind: 'field',
                            type: 'switch',
                            label: 'Field 3',
                            name: 'field_3',
                        }
                    ]
                }
            ],
        },
    }

    it.each([
        { id: 'field-1', expectedKind: 'field' },
        { id: 'field-2', expectedKind: 'field' },
        { id: 'field-3', expectedKind: 'field' },
        { id: 'group-2', expectedKind: 'field_group' },
    ])('should find item $id in tree', ({ id, expectedKind }) => {
        const item = findItemById(itemsData, id)
        expect(item).not.toBeNull()
        expect(item?.id).toBe(id)
        if (expectedKind) {
            expect(item?.kind).toBe(expectedKind)
        }
    })

    it('should return null for non-existent items', () => {
        const item = findItemById(itemsData, 'non-existent')
        expect(item).toBeNull()
    })
})

describe('isDescendantOrSelf', () => {
    const itemsData: Record<string, CanvasItem> = {
        'field-1': {
            id: 'field-1',
            kind: 'field',
            type: 'text',
            label: 'Field 1',
            name: 'field_1',
        },
        'group-1': {
            id: 'group-1',
            kind: 'field_group',
            label: 'Group 1',
            items: [
                {
                    id: 'field-2',
                    kind: 'field',
                    type: 'number',
                    label: 'Field 2',
                    name: 'field_2',
                },
                {
                    id: 'group-2',
                    kind: 'field_group',
                    label: 'Group 2',
                    items: [
                        {
                            id: 'field-3',
                            kind: 'field',
                            type: 'switch',
                            label: 'Field 3',
                            name: 'field_3',
                        }
                    ]
                }
            ],
        },
    }

    it('should return true if parentId and childId are the same', () => {
        expect(isDescendantOrSelf(itemsData, 'group-1', 'group-1')).toBe(true)
        expect(isDescendantOrSelf(itemsData, 'field-1', 'field-1')).toBe(true)
    })

    it('should return true if childId is a direct child of parentId', () => {
        expect(isDescendantOrSelf(itemsData, 'group-1', 'field-2')).toBe(true)
    })

    it('should return true if childId is a deeply nested child of parentId', () => {
        expect(isDescendantOrSelf(itemsData, 'group-1', 'field-3')).toBe(true)
        expect(isDescendantOrSelf(itemsData, 'group-2', 'field-3')).toBe(true)
    })

    it('should return false if childId is not a child of parentId', () => {
        expect(isDescendantOrSelf(itemsData, 'group-2', 'field-2')).toBe(false)
        expect(isDescendantOrSelf(itemsData, 'field-1', 'field-2')).toBe(false)
        expect(isDescendantOrSelf(itemsData, 'group-1', 'field-1')).toBe(false)
    })
})
