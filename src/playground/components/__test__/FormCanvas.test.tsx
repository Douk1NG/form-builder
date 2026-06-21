import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { FormCanvas } from '../FormCanvas'
import { useFormBuilderStore } from '../../store/useFormBuilderStore'

vi.mock('./FieldRenderer', () => ({
  FieldRenderer: ({ id }: { id: string }) => <div data-testid="mock-field-renderer">{id}</div>
}))

vi.mock('../../components/form', () => ({
  default: () => <div data-testid="mock-form-builder">Mock Form Builder</div>
}))

describe('FormCanvas', () => {
  beforeEach(() => {
    useFormBuilderStore.setState({
      formId: null,
      formTitle: '',
      itemIds: [],
      itemsData: {},
      previewMode: false,
    })
  })

  it('renders empty state when form has no fields but has formId', () => {
    useFormBuilderStore.setState({
      formId: '1',
      formTitle: 'Test Form',
      itemIds: []
    })
    render(<FormCanvas />)
    expect(screen.getByText('Drag & Drop fields here')).toBeInTheDocument()
  })

  it('renders field renderers when form has fields', () => {
    useFormBuilderStore.setState({
      formId: '1',
      formTitle: 'Test Form',
      itemIds: ['f1'],
      itemsData: {
        'f1': { id: 'f1', type: 'text', label: 'Field 1', kind: 'field' } as any
      }
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-field-renderer')).toHaveTextContent('f1')
  })

  it('renders preview mode correctly', () => {
    useFormBuilderStore.setState({
      formId: '1',
      formTitle: 'Test Form',
      itemIds: [],
      previewMode: true
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-form-builder')).toBeInTheDocument()
  })
})
