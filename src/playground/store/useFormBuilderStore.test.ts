import { describe, it, expect, beforeEach } from 'vitest'
import { useFormBuilderStore } from './useFormBuilderStore'

describe('useFormBuilderStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useFormBuilderStore.setState({
      formId: null,
      formTitle: '',
      formDescription: '',
      fieldIds: [],
      fieldsData: {},
      selectedFieldId: null,
      previewMode: false,
    })
  })

  it('creates a new form', () => {
    const { createForm } = useFormBuilderStore.getState()
    createForm('Test Form')
    
    const state = useFormBuilderStore.getState()
    expect(state.formId).toBeDefined()
    expect(state.formTitle).toBe('Test Form')
    expect(state.fieldIds).toHaveLength(0)
  })

  it('adds a field to the form', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'First Name' } as any)
    
    const state = useFormBuilderStore.getState()
    expect(state.fieldIds).toHaveLength(1)
    
    const fieldId = state.fieldIds[0]
    expect(state.fieldsData[fieldId].label).toBe('First Name')
  })

  it('inserts a field at a specific index', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'Field 1' } as any)
    store.addField({ type: 'text', label: 'Field 3' } as any)
    
    store.insertFieldAt(1, { type: 'text', label: 'Field 2' } as any)
    
    const state = useFormBuilderStore.getState()
    expect(state.fieldIds).toHaveLength(3)
    
    const secondFieldId = state.fieldIds[1]
    expect(state.fieldsData[secondFieldId].label).toBe('Field 2')
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
    const { fieldIds, fieldsData } = state
    
    expect(fieldsData[fieldIds[0]].label).toBe('Field B')
    expect(fieldsData[fieldIds[1]].label).toBe('Field C')
    expect(fieldsData[fieldIds[2]].label).toBe('Field A')
  })

  it('removes a field', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Test Form')
    
    store.addField({ type: 'text', label: 'Field to remove' } as any)
    const fieldId = useFormBuilderStore.getState().fieldIds[0]
    
    if (fieldId) {
      store.removeField(fieldId)
    }
    
    const state = useFormBuilderStore.getState()
    expect(state.fieldIds).toHaveLength(0)
    expect(state.fieldsData[fieldId]).toBeUndefined()
  })

  it('returns full FormSchema via getFormSchema', () => {
    const store = useFormBuilderStore.getState()
    store.createForm('Schema Test')
    store.addField({ type: 'text', label: 'Text' } as any)
    
    const schema = useFormBuilderStore.getState().getFormSchema()
    expect(schema).toBeDefined()
    expect(schema?.title).toBe('Schema Test')
    expect(schema?.fields).toHaveLength(1)
    expect(schema?.fields[0].label).toBe('Text')
  })
})
