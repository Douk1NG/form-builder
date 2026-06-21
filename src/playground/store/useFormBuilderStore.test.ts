import { describe, it, expect, beforeEach } from 'vitest'
import { useFormBuilderStore } from './useFormBuilderStore'

describe('useFormBuilderStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useFormBuilderStore.setState({
      currentForm: null,
      selectedFieldId: null,
      previewMode: false,
    })
  })

  it('creates a new form', () => {
    const { createForm } = useFormBuilderStore.getState()
    createForm('Test Form')
    
    const state = useFormBuilderStore.getState()
    expect(state.currentForm).toBeDefined()
    expect(state.currentForm?.title).toBe('Test Form')
    expect(state.currentForm?.fields).toHaveLength(0)
  })

  it('adds a field to the form', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'First Name' } as any)
    
    const state = useFormBuilderStore.getState()
    expect(state.currentForm?.fields).toHaveLength(1)
    expect(state.currentForm?.fields[0].label).toBe('First Name')
  })

  it('inserts a field at a specific index', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'Field 1' } as any)
    store.addField({ type: 'text', label: 'Field 3' } as any)
    
    store.insertFieldAt(1, { type: 'text', label: 'Field 2' } as any)
    
    const state = useFormBuilderStore.getState()
    expect(state.currentForm?.fields).toHaveLength(3)
    expect(state.currentForm?.fields[1].label).toBe('Field 2')
  })

  it('moves a field from source to destination index', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'Field A' } as any)
    store.addField({ type: 'text', label: 'Field B' } as any)
    store.addField({ type: 'text', label: 'Field C' } as any)
    
    // Move 'Field A' to the end
    store.moveField(0, 2)
    
    const state = useFormBuilderStore.getState()
    const fields = state.currentForm?.fields || []
    expect(fields[0].label).toBe('Field B')
    expect(fields[1].label).toBe('Field C')
    expect(fields[2].label).toBe('Field A')
  })

  it('removes a field', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'Field to remove' } as any)
    const fieldId = useFormBuilderStore.getState().currentForm?.fields[0].id
    
    if (fieldId) {
      store.removeField(fieldId)
    }
    
    const state = useFormBuilderStore.getState()
    expect(state.currentForm?.fields).toHaveLength(0)
  })
})
