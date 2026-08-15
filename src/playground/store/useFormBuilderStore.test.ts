import { describe, it, expect, beforeEach } from 'vitest'
import { useFormBuilderStore } from './useFormBuilderStore'
import type { CanvasField, FieldGroup, TextField } from '@/types/form'

const OUTER_GROUP = 'Outer Group'
const INNER_GROUP = 'Inner Group'
const NESTED_FIELD = 'Nested Field'
const UPDATED_NESTED_FIELD = 'Updated Nested Field'
const EMPTY_STRING = ''

function getFieldLabel(item: CanvasField): string {
  if (typeof item.label === 'string') return item.label
  return EMPTY_STRING
}

function assertCanvasField(item: unknown): asserts item is CanvasField {
  const candidate = item as Record<string, unknown>
  if (!candidate || candidate.kind !== 'field') {
    throw new Error(`Expected a CanvasField but got kind="${String(candidate?.kind)}"`)
  }
}

function assertFieldGroup(item: unknown): asserts item is FieldGroup {
  const candidate = item as Record<string, unknown>
  if (!candidate || candidate.kind !== 'field_group') {
    throw new Error(`Expected a FieldGroup but got kind="${String(candidate?.kind)}"`)
  }
}

describe('useFormBuilderStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useFormBuilderStore.setState({
      formId: '',
      formTitle: '',
      formDescription: '',
      itemIds: [],
      itemsData: {},
      selectedItemId: null,
      previewMode: false,
      savedForms: {},
    })
  })

  it('creates a new form', () => {
    const { createNewForm } = useFormBuilderStore.getState()
    createNewForm('Test Form')

    const state = useFormBuilderStore.getState()
    expect(state.formId).toBeDefined()
    expect(state.formTitle).toBe('Test Form')
    expect(state.itemIds).toHaveLength(0)
  })

  it('deletes a form that is not the active one', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Active Form')
    const activeFormId = useFormBuilderStore.getState().formId

    store.createNewForm('Other Form')
    const otherFormId = useFormBuilderStore.getState().formId

    // Switch back to active form
    store.switchForm(activeFormId)

    // Delete the other form
    store.deleteForm(otherFormId)

    const state = useFormBuilderStore.getState()
    expect(state.formId).toBe(activeFormId)
    expect(state.savedForms[otherFormId]).toBeUndefined()
    expect(state.savedForms[activeFormId]).toBeDefined()
  })

  it('deletes the active form and switches to another remaining form', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Form A')
    const formAId = useFormBuilderStore.getState().formId

    store.createNewForm('Form B')
    const formBId = useFormBuilderStore.getState().formId

    // Delete Form B (which is currently active)
    store.deleteForm(formBId)

    const state = useFormBuilderStore.getState()
    expect(state.formId).toBe(formAId)
    expect(state.formTitle).toBe('Form A')
    expect(state.savedForms[formBId]).toBeUndefined()
  })

  it('deletes the active form and resets when no forms are left', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Only Form')
    const formId = useFormBuilderStore.getState().formId

    store.deleteForm(formId)

    const state = useFormBuilderStore.getState()
    expect(state.formId).toBe('')
    expect(state.formTitle).toBe('')
    expect(Object.keys(state.savedForms)).toHaveLength(0)
  })

  it('adds a field to the form', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    const textField: Omit<TextField, 'id'> = { type: 'text', label: 'First Name' }
    store.addField(textField)

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(1)

    const itemId = state.itemIds[0]
    const item = state.itemsData[itemId]
    assertCanvasField(item)
    expect(getFieldLabel(item)).toBe('First Name')
  })

  it('inserts a field at a specific index', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    const field1: Omit<TextField, 'id'> = { type: 'text', label: 'Field 1' }
    const field3: Omit<TextField, 'id'> = { type: 'text', label: 'Field 3' }
    store.addField(field1)
    store.addField(field3)

    const insertedField: CanvasField = { type: 'text', label: 'Field 2', id: 'temp-id', kind: 'field' }
    store.insertItemAt(1, insertedField)

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(3)

    const secondItemId = state.itemIds[1]
    const secondItem = state.itemsData[secondItemId]
    assertCanvasField(secondItem)
    expect(getFieldLabel(secondItem)).toBe('Field 2')
  })

  it('moves an item from source to destination index', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    const fieldA: Omit<TextField, 'id'> = { type: 'text', label: 'Field A' }
    const fieldB: Omit<TextField, 'id'> = { type: 'text', label: 'Field B' }
    const fieldC: Omit<TextField, 'id'> = { type: 'text', label: 'Field C' }
    store.addField(fieldA)
    store.addField(fieldB)
    store.addField(fieldC)

    // Move 'Field A' to the end
    store.moveItem(0, 2)

    const state = useFormBuilderStore.getState()
    const { itemIds, itemsData } = state

    const firstItem = itemsData[itemIds[0]]
    const secondItem = itemsData[itemIds[1]]
    const thirdItem = itemsData[itemIds[2]]
    assertCanvasField(firstItem)
    assertCanvasField(secondItem)
    assertCanvasField(thirdItem)

    expect(getFieldLabel(firstItem)).toBe('Field B')
    expect(getFieldLabel(secondItem)).toBe('Field C')
    expect(getFieldLabel(thirdItem)).toBe('Field A')
  })

  it('removes an item', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    const fieldToRemove: Omit<TextField, 'id'> = { type: 'text', label: 'Field to remove' }
    store.addField(fieldToRemove)
    const itemId = useFormBuilderStore.getState().itemIds[0]

    if (itemId) {
      store.removeCanvasItem(itemId)
    }

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(0)
    expect(state.itemsData[itemId]).toBeUndefined()
  })

  it('returns full FormSchema via getFormSchema', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Schema Test')

    const textField: Omit<TextField, 'id'> = { type: 'text', label: 'Text' }
    store.addField(textField)

    const schema = useFormBuilderStore.getState().getFormSchema()
    expect(schema).toBeDefined()
    expect(schema?.title).toBe('Schema Test')
    expect(schema?.items).toHaveLength(1)

    const firstItem = schema?.items[0]
    assertCanvasField(firstItem)
    expect(getFieldLabel(firstItem)).toBe('Text')
  })

  describe('nested group actions', () => {
    it('supports addGroupToGroup and addRowToGroup inside locked groups', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Nested Test')

      // Add a group first
      store.addGroup(OUTER_GROUP)
      const state1 = useFormBuilderStore.getState()
      const outerGroupId = state1.itemIds[0]
      expect(state1.lockedGroupId).toBe(outerGroupId)

      // Add group to group
      store.addGroupToGroup(outerGroupId, INNER_GROUP)
      const state2 = useFormBuilderStore.getState()
      const outerGroup = state2.itemsData[outerGroupId]
      expect(outerGroup.kind).toBe('field_group')
      assertFieldGroup(outerGroup)
      expect(outerGroup.items).toHaveLength(1)
      const innerGroup = outerGroup.items[0]
      expect(innerGroup.kind).toBe('field_group')
      assertFieldGroup(innerGroup)
      expect(innerGroup.label).toBe(INNER_GROUP)

      // Now add row to the inner group
      store.addRowToGroup(innerGroup.id)
      const state3 = useFormBuilderStore.getState()
      const updatedOuterGroup = state3.itemsData[outerGroupId]
      assertFieldGroup(updatedOuterGroup)
      const updatedInnerGroup = updatedOuterGroup.items[0]
      assertFieldGroup(updatedInnerGroup)
      expect(updatedInnerGroup.items).toHaveLength(1)
      expect(updatedInnerGroup.items[0].kind).toBe('field_group')
      assertFieldGroup(updatedInnerGroup.items[0])
      expect(updatedInnerGroup.items[0].columns).toBe(2)
    })

    it('recursively adds, updates, and removes fields in nested groups', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Nested Recursive Test')

      // Add an outer group
      store.addGroup(OUTER_GROUP)
      const outerGroupId = useFormBuilderStore.getState().itemIds[0]

      // Add inner group
      store.addGroupToGroup(outerGroupId, INNER_GROUP)
      const outerGroupData = useFormBuilderStore.getState().itemsData[outerGroupId]
      assertFieldGroup(outerGroupData)
      const innerGroup = outerGroupData.items[0]
      const innerGroupId = innerGroup.id

      // Add field to nested group
      const newField: Omit<TextField, 'id'> = { type: 'text', label: NESTED_FIELD, name: 'nested_field' }
      store.addFieldToGroup(innerGroupId, newField)

      let state = useFormBuilderStore.getState()
      let outerGroupItem = state.itemsData[outerGroupId]
      assertFieldGroup(outerGroupItem)
      let updatedInnerGroup = outerGroupItem.items[0]
      assertFieldGroup(updatedInnerGroup)
      expect(updatedInnerGroup.items).toHaveLength(1)
      const fieldId = updatedInnerGroup.items[0].id
      expect(updatedInnerGroup.items[0].label).toBe(NESTED_FIELD)

      // Update nested field
      store.updateField(fieldId, { label: UPDATED_NESTED_FIELD })
      state = useFormBuilderStore.getState()
      outerGroupItem = state.itemsData[outerGroupId]
      assertFieldGroup(outerGroupItem)
      updatedInnerGroup = outerGroupItem.items[0]
      assertFieldGroup(updatedInnerGroup)
      expect(updatedInnerGroup.items[0].label).toBe(UPDATED_NESTED_FIELD)

      // Remove nested field
      store.removeFieldFromGroup(innerGroupId, fieldId)
      state = useFormBuilderStore.getState()
      outerGroupItem = state.itemsData[outerGroupId]
      assertFieldGroup(outerGroupItem)
      updatedInnerGroup = outerGroupItem.items[0]
      assertFieldGroup(updatedInnerGroup)
      expect(updatedInnerGroup.items).toHaveLength(0)
    })

    it('recursively removes nested canvas items using removeCanvasItem', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Recursive Removal Test')

      store.addGroup('Outer Group')
      const outerGroupId = useFormBuilderStore.getState().itemIds[0]

      store.addGroupToGroup(outerGroupId, 'Inner Group')
      const outerGroupForSetup = useFormBuilderStore.getState().itemsData[outerGroupId]
      assertFieldGroup(outerGroupForSetup)
      const innerGroupId = outerGroupForSetup.items[0].id

      const newField: Omit<TextField, 'id'> = { type: 'text', label: 'Nested Field', name: 'nested_field' }
      store.addFieldToGroup(innerGroupId, newField)

      let state = useFormBuilderStore.getState()
      let outerGroupItem = state.itemsData[outerGroupId]
      assertFieldGroup(outerGroupItem)
      let updatedInnerGroup = outerGroupItem.items[0]
      assertFieldGroup(updatedInnerGroup)
      const fieldId = updatedInnerGroup.items[0].id

      // Remove using removeCanvasItem
      store.removeCanvasItem(fieldId)
      state = useFormBuilderStore.getState()
      outerGroupItem = state.itemsData[outerGroupId]
      assertFieldGroup(outerGroupItem)
      updatedInnerGroup = outerGroupItem.items[0]
      assertFieldGroup(updatedInnerGroup)
      expect(updatedInnerGroup.items).toHaveLength(0)
    })

    it('reorders items within a group using moveCanvasItem', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Reorder Test')

      store.addGroup('Group')
      const groupId = useFormBuilderStore.getState().itemIds[0]

      const fieldAPayload: Omit<TextField, 'id'> = { type: 'text', label: 'Field A', name: 'a' }
      const fieldBPayload: Omit<TextField, 'id'> = { type: 'text', label: 'Field B', name: 'b' }
      store.addFieldToGroup(groupId, fieldAPayload)
      store.addFieldToGroup(groupId, fieldBPayload)

      let state = useFormBuilderStore.getState()
      const group = state.itemsData[groupId]
      assertFieldGroup(group)
      const fieldAId = group.items[0].id
      const fieldBId = group.items[1].id

      // Move Field A after Field B (bottom edge)
      store.moveCanvasItem(fieldAId, fieldBId, 'bottom')

      state = useFormBuilderStore.getState()
      const updatedGroup = state.itemsData[groupId]
      assertFieldGroup(updatedGroup)
      expect(updatedGroup.items[0].id).toBe(fieldBId)
      expect(updatedGroup.items[1].id).toBe(fieldAId)
    })

    describe('reorderFieldInGroup', () => {
      it('reorders fields inside a group up and down', () => {
        const store = useFormBuilderStore.getState()
        store.createNewForm('Reorder Field In Group Test')

        store.addGroup('Group')
        const groupId = useFormBuilderStore.getState().itemIds[0]

        store.addFieldToGroup(groupId, { type: 'text', label: 'Field 1', name: 'f1' })
        store.addFieldToGroup(groupId, { type: 'text', label: 'Field 2', name: 'f2' })
        store.addFieldToGroup(groupId, { type: 'text', label: 'Field 3', name: 'f3' })

        let state = useFormBuilderStore.getState()
        const group = state.itemsData[groupId]
        assertFieldGroup(group)
        const f1Id = group.items[0].id
        const f2Id = group.items[1].id
        const f3Id = group.items[2].id

        // Reorder f2 up
        store.reorderFieldInGroup(groupId, f2Id, 'up')
        state = useFormBuilderStore.getState()
        let updatedGroup = state.itemsData[groupId]
        assertFieldGroup(updatedGroup)
        expect(updatedGroup.items[0].id).toBe(f2Id)
        expect(updatedGroup.items[1].id).toBe(f1Id)
        expect(updatedGroup.items[2].id).toBe(f3Id)

        // Reorder f2 down
        store.reorderFieldInGroup(groupId, f2Id, 'down')
        state = useFormBuilderStore.getState()
        updatedGroup = state.itemsData[groupId]
        assertFieldGroup(updatedGroup)
        expect(updatedGroup.items[0].id).toBe(f1Id)
        expect(updatedGroup.items[1].id).toBe(f2Id)
        expect(updatedGroup.items[2].id).toBe(f3Id)

        // Reorder f1 up (boundary - should do nothing)
        store.reorderFieldInGroup(groupId, f1Id, 'up')
        state = useFormBuilderStore.getState()
        updatedGroup = state.itemsData[groupId]
        assertFieldGroup(updatedGroup)
        expect(updatedGroup.items[0].id).toBe(f1Id)

        // Reorder f3 down (boundary - should do nothing)
        store.reorderFieldInGroup(groupId, f3Id, 'down')
        state = useFormBuilderStore.getState()
        updatedGroup = state.itemsData[groupId]
        assertFieldGroup(updatedGroup)
        expect(updatedGroup.items[2].id).toBe(f3Id)
      })
    })

    it('moves a field from one group to another using moveFieldToGroup', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Cross Group Move Test')

      store.addGroup('Group A')
      const groupAId = useFormBuilderStore.getState().itemIds[0]
      // Reset locked group so we can add a second top-level group
      useFormBuilderStore.setState({ lockedGroupId: null })

      store.addGroup('Group B')
      const groupBId = useFormBuilderStore.getState().itemIds[1]

      // Add a field to Group A
      const movablePayload: Omit<TextField, 'id'> = { type: 'text', label: 'Movable Field', name: 'movable' }
      store.addFieldToGroup(groupAId, movablePayload)
      let state = useFormBuilderStore.getState()
      const groupAData = state.itemsData[groupAId]
      assertFieldGroup(groupAData)
      const fieldId = groupAData.items[0].id

      // Move from Group A to Group B
      store.moveFieldToGroup(fieldId, groupBId)
      state = useFormBuilderStore.getState()
      const updatedGroupA = state.itemsData[groupAId]
      assertFieldGroup(updatedGroupA)
      expect(updatedGroupA.items).toHaveLength(0)
      const updatedGroupB = state.itemsData[groupBId]
      assertFieldGroup(updatedGroupB)
      expect(updatedGroupB.items).toHaveLength(1)
      expect(updatedGroupB.items[0].label).toBe('Movable Field')
    })

    it('sets a default label of "" when creating a group from drop', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Drop Group Label Test')

      store.addField({ type: 'text', label: 'Field A', name: 'a' })
      store.addField({ type: 'text', label: 'Field B', name: 'b' })

      const state1 = useFormBuilderStore.getState()
      const fieldAId = state1.itemIds[0]
      const fieldBId = state1.itemIds[1]

      // Create group from drop (drop A to the left of B)
      store.createGroupFromDrop(fieldAId, fieldBId, 'left')

      const state2 = useFormBuilderStore.getState()
      const createdGroupId = state2.itemIds[0]
      const groupItem = state2.itemsData[createdGroupId]
      expect(groupItem.kind).toBe('field_group')
      assertFieldGroup(groupItem)
      expect(groupItem.label).toBe(EMPTY_STRING)
    })

    it('sets a default label of "" when creating a group with a new field from drop', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('New Field Drop Group Label Test')

      store.addField({ type: 'text', label: 'Existing Field', name: 'existing' })

      const state1 = useFormBuilderStore.getState()
      const existingFieldId = state1.itemIds[0]

      // Drop a new field to create a group
      store.createGroupWithNewField(existingFieldId, { type: 'text', label: 'New Field' }, 'right')

      const state2 = useFormBuilderStore.getState()
      const createdGroupId = state2.itemIds[0]
      const groupItem = state2.itemsData[createdGroupId]
      expect(groupItem.kind).toBe('field_group')
      assertFieldGroup(groupItem)
      expect(groupItem.label).toBe(EMPTY_STRING)
    })

    it('creates a 2 Columns Row from two fields inside a group using createGroupFromDrop', () => {
      const store = useFormBuilderStore.getState()
      store.createNewForm('Nested CreateGroup Test')

      store.addGroup('Parent Group')
      const parentGroupId = useFormBuilderStore.getState().itemIds[0]

      const fieldAGroupPayload: Omit<TextField, 'id'> = { type: 'text', label: 'Field A', name: 'a' }
      const fieldBGroupPayload: Omit<TextField, 'id'> = { type: 'text', label: 'Field B', name: 'b' }
      store.addFieldToGroup(parentGroupId, fieldAGroupPayload)
      store.addFieldToGroup(parentGroupId, fieldBGroupPayload)

      let state = useFormBuilderStore.getState()
      const parentGroup = state.itemsData[parentGroupId]
      assertFieldGroup(parentGroup)
      const fieldAId = parentGroup.items[0].id
      const fieldBId = parentGroup.items[1].id

      // Drop Field A to the left of Field B (both inside the group)
      store.createGroupFromDrop(fieldAId, fieldBId, 'left')

      state = useFormBuilderStore.getState()
      const updatedParent = state.itemsData[parentGroupId]
      assertFieldGroup(updatedParent)
      // The two fields should now be replaced by a single 2 Columns Row group
      expect(updatedParent.items).toHaveLength(1)
      expect(updatedParent.items[0].kind).toBe('field_group')
      const nestedRow = updatedParent.items[0]
      assertFieldGroup(nestedRow)
      expect(nestedRow.label).toBe(EMPTY_STRING)
      expect(nestedRow.columns).toBe(2)
      expect(nestedRow.items).toHaveLength(2)
      expect(nestedRow.items[0].id).toBe(fieldAId)
      expect(nestedRow.items[1].id).toBe(fieldBId)
    })
  })
})
