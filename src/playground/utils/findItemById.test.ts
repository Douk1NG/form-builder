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

    it('should find a top-level field', () => {
        const item = findItemById(itemsData, 'field-1')
        expect(item).not.toBeNull()
        expect(item?.id).toBe('field-1')
        expect(item?.kind).toBe('field')
    })

    it('should find a nested field inside a group', () => {
        const item = findItemById(itemsData, 'field-2')
        expect(item).not.toBeNull()
        expect(item?.id).toBe('field-2')
    })

    it('should find a deeply nested field', () => {
        const item = findItemById(itemsData, 'field-3')
        expect(item).not.toBeNull()
        expect(item?.id).toBe('field-3')
    })

    it('should find a nested group', () => {
        const item = findItemById(itemsData, 'group-2')
        expect(item).not.toBeNull()
        expect(item?.id).toBe('group-2')
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
