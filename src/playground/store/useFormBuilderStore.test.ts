import { describe, it, expect, beforeEach } from 'vitest'
import { useFormBuilderStore } from './useFormBuilderStore'

describe('useFormBuilderStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useFormBuilderStore.setState({
      formId: null,
      formTitle: '',
      formDescription: '',
      itemIds: [],
      itemsData: {},
      selectedItemId: null,
      previewMode: false,
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

  it('adds a field to the form', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    store.addField({ type: 'text', label: 'First Name' } as any)

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(1)

    const itemId = state.itemIds[0]
    expect((state.itemsData[itemId] as any).label).toBe('First Name')
  })

  it('inserts a field at a specific index', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    store.addField({ type: 'text', label: 'Field 1' } as any)
    store.addField({ type: 'text', label: 'Field 3' } as any)

    store.insertItemAt(1, { type: 'text', label: 'Field 2', id: 'temp-id', kind: 'field' } as any)

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(3)

    const secondItemId = state.itemIds[1]
    expect((state.itemsData[secondItemId] as any).label).toBe('Field 2')
  })

  it('moves an item from source to destination index', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    store.addField({ type: 'text', label: 'Field A' } as any)
    store.addField({ type: 'text', label: 'Field B' } as any)
    store.addField({ type: 'text', label: 'Field C' } as any)

    // Move 'Field A' to the end
    store.moveItem(0, 2)

    const state = useFormBuilderStore.getState()
    const { itemIds, itemsData } = state

    expect((itemsData[itemIds[0]] as any).label).toBe('Field B')
    expect((itemsData[itemIds[1]] as any).label).toBe('Field C')
    expect((itemsData[itemIds[2]] as any).label).toBe('Field A')
  })

  it('removes an item', () => {
    const store = useFormBuilderStore.getState()
    store.createNewForm('Test Form')

    store.addField({ type: 'text', label: 'Field to remove' } as any)
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
    store.addField({ type: 'text', label: 'Text' } as any)

    const schema = useFormBuilderStore.getState().getFormSchema()
    expect(schema).toBeDefined()
    expect(schema?.title).toBe('Schema Test')
    expect(schema?.items).toHaveLength(1)
    expect((schema?.items[0] as any).label).toBe('Text')
  })
})
