import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { generateUuid } from '@/lib/utils'

import {
    isPaletteDragData,
    isCanvasDragData,
    type PaletteDragData,
    type CanvasDropData
} from '@/playground/types/dragDropTypes'

import type {
    FieldType,
    CanvasItem,
    NewFieldInput
} from '@/types/form'

import type { CanvasListActions } from '../store/slices/Canvas/CanvasListActions'
import { findItemById, isDescendantOrSelf } from '@/playground/utils/findItemById'
import { DEFAULT_GROUP_LABEL, DEFAULT_TWO_COLUMN_COUNT, FIELD_ID_SUFFIX_LENGTH } from '../constants/fieldDefaults'
import { ITEM_KINDS } from '@/types/itemKinds'

export type HandleCanvasDropParameters = {
    sourceData: Record<string, unknown>
    destinationData: Record<string, unknown>
    itemIds: string[]
    itemsData: Record<string, CanvasItem>
    insertItemAt: CanvasListActions['insertItemAt']
    moveItem: CanvasListActions['moveItem']
    moveCanvasItem: CanvasListActions['moveCanvasItem']
    addField: CanvasListActions['addField']
    addFieldToGroup: (groupId: string, field: NewFieldInput) => void
    addGroupToGroup: (groupId: string, label: string) => void
    addRowToGroup: (groupId: string) => void
    createGroupFromDrop: (sourceId: string, targetId: string, edge: 'left' | 'right') => void
    createGroupWithNewField: (targetId: string, field: NewFieldInput, edge: 'left' | 'right') => void
    moveFieldToGroup: (sourceId: string, groupId: string) => void
    mergeGroupIntoGroup: (sourceId: string, targetId: string) => void
}

function handlePaletteLayoutDrop(
    fieldType: typeof ITEM_KINDS.FIELD_GROUP | typeof ITEM_KINDS.COLUMN_ROW,
    destinationData: CanvasDropData,
    itemIds: string[],
    dependencies: Pick<HandleCanvasDropParameters, 'insertItemAt' | 'addGroupToGroup' | 'addRowToGroup'>
) {
    const isColumnRow = fieldType === ITEM_KINDS.COLUMN_ROW
    
    if (destinationData.groupId) {
        if (isColumnRow) {
            dependencies.addRowToGroup(destinationData.groupId)
        } else {
            dependencies.addGroupToGroup(destinationData.groupId, DEFAULT_GROUP_LABEL)
        }
        return
    }

    const newGroup: CanvasItem = {
        id: generateUuid(),
        kind: ITEM_KINDS.FIELD_GROUP,
        label: isColumnRow ? '' : DEFAULT_GROUP_LABEL,
        ...(isColumnRow ? { columns: DEFAULT_TWO_COLUMN_COUNT } : {}),
        items: [],
    }

    if (destinationData.isCanvas) {
        dependencies.insertItemAt(itemIds.length, newGroup)
    } else if (typeof destinationData.insertIndex === 'number') {
        dependencies.insertItemAt(destinationData.insertIndex, newGroup)
    }
}

function handlePaletteFieldDrop(
    paletteData: Omit<PaletteDragData, 'type'> & { type: FieldType },
    destinationData: CanvasDropData,
    edge: ReturnType<typeof extractClosestEdge>,
    dependencies: Pick<HandleCanvasDropParameters, 'createGroupWithNewField' | 'addField' | 'insertItemAt' | 'addFieldToGroup'>
) {
    const field = {
        type: paletteData.type,
        label: paletteData.label,
        name: `field_${generateUuid().slice(0, FIELD_ID_SUFFIX_LENGTH)}`,
    }

    if ((edge === 'left' || edge === 'right') && destinationData.id) {
        dependencies.createGroupWithNewField(destinationData.id, field, edge)
    } else if (destinationData.isCanvas) {
        dependencies.addField(field)
    } else if (typeof destinationData.insertIndex === 'number') {
        const newItem: CanvasItem = { ...field, id: generateUuid(), kind: ITEM_KINDS.FIELD }
        dependencies.insertItemAt(destinationData.insertIndex, newItem)
    } else if (destinationData.groupId) {
        dependencies.addFieldToGroup(destinationData.groupId, field)
    }
}

function handleGroupDestinationDrop(
    sourceItem: CanvasItem | null,
    sourceId: string,
    destinationGroupId: string,
    dependencies: Pick<HandleCanvasDropParameters, 'mergeGroupIntoGroup' | 'moveFieldToGroup'>
) {
    if (sourceItem?.kind === ITEM_KINDS.FIELD_GROUP) {
        dependencies.mergeGroupIntoGroup(sourceId, destinationGroupId)
    } else {
        dependencies.moveFieldToGroup(sourceId, destinationGroupId)
    }
}

function tryTargetSpecificDrop(
    sourceItem: CanvasItem | null,
    sourceId: string,
    targetItem: CanvasItem | null,
    targetId: string | undefined,
    edge: ReturnType<typeof extractClosestEdge>,
    dependencies: Pick<HandleCanvasDropParameters, 'mergeGroupIntoGroup' | 'createGroupFromDrop'>
): boolean {
    if (!targetId) return false

    if (sourceItem?.kind === ITEM_KINDS.FIELD_GROUP && targetItem?.kind === ITEM_KINDS.FIELD_GROUP) {
        dependencies.mergeGroupIntoGroup(sourceId, targetId)
        return true
    }

    if ((edge === 'left' || edge === 'right') && sourceItem?.kind === ITEM_KINDS.FIELD && targetItem?.kind === ITEM_KINDS.FIELD) {
        dependencies.createGroupFromDrop(sourceId, targetId, edge)
        return true
    }

    return false
}

function handleCanvasSourceDrop(
    canvasData: { id: string; index: number },
    destinationData: CanvasDropData,
    edge: ReturnType<typeof extractClosestEdge>,
    itemsData: Record<string, CanvasItem>,
    dependencies: Pick<HandleCanvasDropParameters, 'mergeGroupIntoGroup' | 'moveFieldToGroup' | 'createGroupFromDrop' | 'moveItem' | 'moveCanvasItem'>
) {
    const sourceId = canvasData.id
    const sourceItem = findItemById(itemsData, sourceId)
    const targetId = destinationData.id
    const targetItem = targetId ? findItemById(itemsData, targetId) : null

    if (targetId && isDescendantOrSelf(itemsData, sourceId, targetId)) {
        return
    }

    if (destinationData.groupId && isDescendantOrSelf(itemsData, sourceId, destinationData.groupId)) {
        return
    }

    if (destinationData.groupId) {
        handleGroupDestinationDrop(sourceItem, sourceId, destinationData.groupId, dependencies)
        return
    }

    if (tryTargetSpecificDrop(sourceItem, sourceId, targetItem, targetId, edge, dependencies)) {
        return
    }

    if (targetId && edge) {
        dependencies.moveCanvasItem(sourceId, targetId, edge)
        return
    }

    if (typeof destinationData.index === 'number') {
        dependencies.moveItem(canvasData.index, destinationData.index)
    }
}

export function handleCanvasDrop({
    sourceData,
    destinationData,
    itemIds,
    itemsData,
    insertItemAt,
    moveItem,
    moveCanvasItem,
    addField,
    addFieldToGroup,
    addGroupToGroup,
    addRowToGroup,
    createGroupFromDrop,
    createGroupWithNewField,
    moveFieldToGroup,
    mergeGroupIntoGroup,
}: HandleCanvasDropParameters) {
    const edge = extractClosestEdge(destinationData)
    const typedDestinationData = destinationData as CanvasDropData

    if (isPaletteDragData(sourceData)) {
        if (sourceData.type === ITEM_KINDS.FIELD_GROUP || sourceData.type === ITEM_KINDS.COLUMN_ROW) {
            handlePaletteLayoutDrop(
                sourceData.type,
                typedDestinationData,
                itemIds,
                { insertItemAt, addGroupToGroup, addRowToGroup }
            )
        } else {
            handlePaletteFieldDrop(
                sourceData as Omit<PaletteDragData, 'type'> & { type: FieldType },
                typedDestinationData,
                edge,
                {
                    createGroupWithNewField,
                    addField,
                    insertItemAt,
                    addFieldToGroup
                }
            )
        }
        return
    }

    if (isCanvasDragData(sourceData)) {
        handleCanvasSourceDrop(
            {
                id: sourceData.id,
                index: sourceData.index
            },
            typedDestinationData,
            edge,
            itemsData,
            { mergeGroupIntoGroup, moveFieldToGroup, createGroupFromDrop, moveItem, moveCanvasItem }
        )
    }
}