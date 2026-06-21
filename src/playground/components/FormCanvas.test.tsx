import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { FormCanvas } from './FormCanvas'
import { useFormBuilderStore } from '../store/useFormBuilderStore'

// Mock the child components to simplify the test
vi.mock('../../components/form', () => ({
  default: () => <div data-testid="mock-form-builder">Mock Form Builder</div>
}))

vi.mock('../../components/form/field', () => ({
  default: ({ label }: { label: string }) => <div data-testid="mock-field">{label}</div>
}))

describe('FormCanvas', () => {
  beforeEach(() => {
    useFormBuilderStore.setState({
      currentForm: null,
      previewMode: false,
    })
  })

  it('renders nothing when no form is selected', () => {
    const { container } = render(<FormCanvas />)
    expect(container.firstChild).toBeNull()
  })

  it('renders empty state when form has no fields', () => {
    useFormBuilderStore.setState({
      currentForm: { id: '1', title: 'Test Form', fields: [] }
    })
    render(<FormCanvas />)
    expect(screen.getByText('Add fields from the palette on the left')).toBeInTheDocument()
    expect(screen.getByText('Test Form')).toBeInTheDocument()
  })

  it('renders fields when form has fields', () => {
    useFormBuilderStore.setState({
      currentForm: { 
        id: '1', 
        title: 'Test Form', 
        fields: [{ id: 'f1', type: 'text', label: 'Field 1' } as any] 
      }
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-field')).toHaveTextContent('Field 1')
  })

  it('renders preview mode correctly', () => {
    useFormBuilderStore.setState({
      currentForm: { id: '1', title: 'Test Form', fields: [] },
      previewMode: true
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-form-builder')).toBeInTheDocument()
  })
})
