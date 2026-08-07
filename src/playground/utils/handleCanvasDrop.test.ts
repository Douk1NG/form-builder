import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleCanvasDrop, type HandleCanvasDropParameters } from './handleCanvasDrop'
import type { PaletteDragData, CanvasDragData, CanvasDropData } from '@/playground/types/dragDropTypes'
import { ITEM_KINDS } from '@/types/itemKinds'

vi.mock('@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge', () => ({
    extractClosestEdge: vi.fn((data: Record<string, unknown>) => data.closestEdge ?? null)
}))

type TestDependencies = Omit<HandleCanvasDropParameters, 'sourceData' | 'destinationData'>

const SOURCE_PALETTE = 'palette'
const TEXT_FIELD_LABEL = 'Text Field'
const DEFAULT_GROUP_LABEL_TEST = 'Field Group'

describe('handleCanvasDrop', () => {
    let dependencies: TestDependencies

    beforeEach(() => {
        vi.clearAllMocks()
        dependencies = {
            itemIds: [],
            itemsData: {},
            insertItemAt: vi.fn(),
            moveItem: vi.fn(),
            moveCanvasItem: vi.fn(),
            addField: vi.fn(),
            addFieldToGroup: vi.fn(),
            addGroupToGroup: vi.fn(),
            addRowToGroup: vi.fn(),
            createGroupFromDrop: vi.fn(),
            createGroupWithNewField: vi.fn(),
            moveFieldToGroup: vi.fn(),
            mergeGroupIntoGroup: vi.fn(),
        }
    })

    describe('Palette to Canvas Layouts (handlePaletteLayoutDrop)', () => {
        it('adds a new group to the canvas', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: ITEM_KINDS.FIELD_GROUP, label: 'Group' }
            const destinationData: CanvasDropData = { isCanvas: true }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.insertItemAt).toHaveBeenCalledWith(0, expect.objectContaining({
                kind: ITEM_KINDS.FIELD_GROUP,
                label: DEFAULT_GROUP_LABEL_TEST,
                items: []
            }))
        })

        it('inserts a new group at a specific index', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: ITEM_KINDS.FIELD_GROUP, label: 'Group' }
            const destinationData: CanvasDropData = { insertIndex: 2 }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.insertItemAt).toHaveBeenCalledWith(2, expect.objectContaining({
                kind: ITEM_KINDS.FIELD_GROUP,
                label: DEFAULT_GROUP_LABEL_TEST,
                items: []
            }))
        })

        it('adds a new row inside a group when layout drops on a group destination', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: ITEM_KINDS.COLUMN_ROW, label: '2 Columns' }
            const destinationData: CanvasDropData = { groupId: 'group-1' }

            dependencies.addGroupToGroup = vi.fn()
            dependencies.addRowToGroup = vi.fn()

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.addRowToGroup).toHaveBeenCalledWith('group-1')
            expect(dependencies.insertItemAt).not.toHaveBeenCalled()
        })

        it('adds a nested group inside a group when layout group drops on a group destination', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: ITEM_KINDS.FIELD_GROUP, label: 'Group' }
            const destinationData: CanvasDropData = { groupId: 'group-1' }

            dependencies.addGroupToGroup = vi.fn()
            dependencies.addRowToGroup = vi.fn()

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.addGroupToGroup).toHaveBeenCalledWith('group-1', DEFAULT_GROUP_LABEL_TEST)
            expect(dependencies.insertItemAt).not.toHaveBeenCalled()
        })
    })

    describe('Palette to Canvas (handlePaletteFieldDrop)', () => {
        it('adds a new field to the canvas', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: 'text', label: TEXT_FIELD_LABEL }
            const destinationData: CanvasDropData = { isCanvas: true }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.addField).toHaveBeenCalledWith(expect.objectContaining({
                type: 'text',
                label: TEXT_FIELD_LABEL
            }))
        })

        it('inserts a new field at a specific index', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: 'text', label: TEXT_FIELD_LABEL }
            const destinationData: CanvasDropData = { insertIndex: 1 }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.insertItemAt).toHaveBeenCalledWith(1, expect.objectContaining({
                type: 'text',
                kind: ITEM_KINDS.FIELD
            }))
        })

        it('adds a new field into a group', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: 'text', label: TEXT_FIELD_LABEL }
            const destinationData: CanvasDropData = { groupId: 'group-1' }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.addFieldToGroup).toHaveBeenCalledWith('group-1', expect.objectContaining({
                type: 'text'
            }))
        })

        it('creates a group with a new field when dropped on the left edge of another field', () => {
            const sourceData: PaletteDragData = { source: SOURCE_PALETTE, type: 'text', label: TEXT_FIELD_LABEL }
            const destinationData: CanvasDropData & { closestEdge: string } = { id: 'field-1', closestEdge: 'left' }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.createGroupWithNewField).toHaveBeenCalledWith('field-1', expect.objectContaining({
                type: 'text'
            }), 'left')
        })
    })

    describe('Canvas to Canvas (handleCanvasSourceDrop)', () => {
        it('moves an item to a specific index', () => {
            const sourceData: CanvasDragData = { source: 'canvas', id: 'field-1', index: 0 }
            const destinationData: CanvasDropData = { index: 2 }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.moveItem).toHaveBeenCalledWith(0, 2)
        })

        it('moves a field into a group', () => {
            const sourceData: CanvasDragData = { source: 'canvas', id: 'field-1', index: 0 }
            const destinationData: CanvasDropData = { groupId: 'group-1' }

            dependencies.itemsData = {
                'field-1': { id: 'field-1', kind: ITEM_KINDS.FIELD, type: 'text', label: 'T', name: 't' }
            }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.moveFieldToGroup).toHaveBeenCalledWith('field-1', 'group-1')
        })

        it('merges a group into another group when dragging onto a group area', () => {
            const sourceData: CanvasDragData = { source: 'canvas', id: 'group-2', index: 1 }
            const destinationData: CanvasDropData = { groupId: 'group-1' }

            dependencies.itemsData = {
                'group-2': { id: 'group-2', kind: ITEM_KINDS.FIELD_GROUP, items: [] }
            }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.mergeGroupIntoGroup).toHaveBeenCalledWith('group-2', 'group-1')
        })

        it('merges two groups when dragging a group onto another group directly', () => {
            const sourceData: CanvasDragData = { source: 'canvas', id: 'group-2', index: 1 }
            const destinationData: CanvasDropData = { id: 'group-1' }

            dependencies.itemsData = {
                'group-2': { id: 'group-2', kind: ITEM_KINDS.FIELD_GROUP, items: [] },
                'group-1': { id: 'group-1', kind: ITEM_KINDS.FIELD_GROUP, items: [] }
            }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.mergeGroupIntoGroup).toHaveBeenCalledWith('group-2', 'group-1')
        })

        it('creates a group from drop when dragging an item to the edge of another item', () => {
            const sourceData: CanvasDragData = { source: 'canvas', id: 'field-1', index: 0 }
            const destinationData: CanvasDropData & { closestEdge: string } = { id: 'field-2', closestEdge: 'right' }

            dependencies.itemsData = {
                'field-1': { id: 'field-1', kind: ITEM_KINDS.FIELD, type: 'text', label: 'T', name: 't' },
                'field-2': { id: 'field-2', kind: ITEM_KINDS.FIELD, type: 'text', label: 'T2', name: 't2' }
            }

            handleCanvasDrop({ sourceData, destinationData, ...dependencies })

            expect(dependencies.createGroupFromDrop).toHaveBeenCalledWith('field-1', 'field-2', 'right')
        })
    })
})
