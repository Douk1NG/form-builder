import { describe, it, expect } from 'vitest'
import { updateFieldInGroupItems } from './CanvasItemTree'
import { ITEM_KINDS } from '@/types/itemKinds'
import type { CanvasField, FieldGroup } from '@/types/form'

describe('updateFieldInGroupItems reference integrity', () => {
    it('returns the exact same array reference if no fields were updated', () => {
        const field1: CanvasField = {
            id: 'field-1',
            kind: ITEM_KINDS.FIELD,
            type: 'text',
            label: 'Field 1',
        }
        
        const group1: FieldGroup = {
            id: 'group-1',
            kind: ITEM_KINDS.FIELD_GROUP,
            label: 'Group 1',
            items: [field1],
        }

        const items = [group1]

        const result = updateFieldInGroupItems(items, 'non-existent-id', { label: 'Updated' })

        // This should be the exact same reference if no changes occurred
        expect(result).toBe(items)
    })

    it('returns a new array reference and updates the correct field if target exists', () => {
        const field1: CanvasField = {
            id: 'field-1',
            kind: ITEM_KINDS.FIELD,
            type: 'text',
            label: 'Field 1',
        }
        
        const group1: FieldGroup = {
            id: 'group-1',
            kind: ITEM_KINDS.FIELD_GROUP,
            label: 'Group 1',
            items: [field1],
        }

        const items = [group1]

        const result = updateFieldInGroupItems(items, 'field-1', { label: 'Updated Label' })

        expect(result).not.toBe(items)
        const updatedGroup = result[0] as FieldGroup
        expect(updatedGroup.items[0].label).toBe('Updated Label')
    })
})
