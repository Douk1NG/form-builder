import { describe, it, expect } from 'vitest'
import { partializeFormBuilderState } from './BuilderPersistence'
import type { FormBuilderState } from './useFormBuilderStore'

function createMockFormBuilderState(
    overrides: Partial<FormBuilderState> = {}
): FormBuilderState {
    return {
        formId: 'test-form-id',
        formTitle: 'Test Form',
        formDescription: 'A test form',
        itemIds: ['field-1'],
        itemsData: {
            'field-1': {
                id: 'field-1',
                kind: 'field' as const,
                type: 'text' as const,
                label: 'Name',
            },
        },
        savedForms: {
            'saved-form-1': {
                formId: 'saved-form-1',
                formTitle: 'Saved Form One',
                formDescription: '',
                itemIds: [],
                itemsData: {},
            },
        },
        addField: () => {},
        addGroup: () => {},
        addRow: () => {},
        removeCanvasItem: () => {},
        reorderItem: () => {},
        insertItemAt: () => {},
        moveItem: () => {},
        moveCanvasItem: () => {},
        getFormSchema: () => null,
        updateField: () => {},
        updateGroup: () => {},
        addFieldToGroup: () => {},
        addGroupToGroup: () => {},
        addRowToGroup: () => {},
        removeFieldFromGroup: () => {},
        createGroupFromDrop: () => {},
        createGroupWithNewField: () => {},
        moveFieldToGroup: () => {},
        mergeGroupIntoGroup: () => {},
        selectedItemId: null,
        lockedGroupId: null,
        previewMode: false,
        previewLocale: 'en',
        previewDevice: 'desktop',
        isPropertiesExpanded: false,
        isPaletteCollapsed: false,
        isPropertiesCollapsed: false,
        isCreateFormDialogOpen: false,
        isRenameFormDialogOpen: false,
        setSelectedItem: () => {},
        setLockedGroup: () => {},
        toggleLockedGroup: () => {},
        setPreviewMode: () => {},
        setPreviewLocale: () => {},
        setPreviewDevice: () => {},
        togglePropertiesExpanded: () => {},
        setPaletteCollapsed: () => {},
        setPropertiesCollapsed: () => {},
        setCreateFormDialogOpen: () => {},
        setRenameFormDialogOpen: () => {},
        createNewForm: () => {},
        switchForm: () => {},
        updateFormTitle: () => {},
        deleteForm: () => {},
        ...overrides,
    }
}

describe('partializeFormBuilderState', () => {
    it('includes savedForms in the persisted state', () => {
        const mockState = createMockFormBuilderState()

        const persistedState = partializeFormBuilderState(mockState)

        expect(persistedState.savedForms).toEqual(mockState.savedForms)
    })

    it('includes all required data fields for restoring state', () => {
        const mockState = createMockFormBuilderState()

        const persistedState = partializeFormBuilderState(mockState)

        expect(persistedState).toEqual({
            formId: 'test-form-id',
            formTitle: 'Test Form',
            formDescription: 'A test form',
            itemIds: ['field-1'],
            itemsData: mockState.itemsData,
            savedForms: mockState.savedForms,
        })
    })

    it('excludes transient ui state from persisted data', () => {
        const mockState = createMockFormBuilderState({
            selectedItemId: 'some-selection',
            previewMode: true,
        })

        const persistedState = partializeFormBuilderState(mockState)
        const persistedKeys = Object.keys(persistedState)

        expect(persistedKeys).not.toContain('selectedItemId')
        expect(persistedKeys).not.toContain('previewMode')
        expect(persistedKeys).not.toContain('previewLocale')
        expect(persistedKeys).not.toContain('previewDevice')
    })
})
