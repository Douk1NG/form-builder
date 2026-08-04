import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { FormCanvas } from './FormCanvas'
import { useFormBuilderStore } from '../../store/useFormBuilderStore'

vi.mock('./CanvasItemRenderer', () => ({
  CanvasItemRenderer: ({ item }: { item: { id: string } }) => (
    <div data-testid="mock-canvas-item-renderer">{item.id}</div>
  ),
}))

vi.mock('./PreviewFormRenderer', () => ({
  PreviewFormRenderer: () => (
    <div data-testid="mock-preview-form-renderer">Preview Mode</div>
  ),
}))

vi.mock('@/playground/hooks/useCanvasDropTarget', () => ({
  useCanvasDropTarget: () => ({
    dropTargetRef: { current: null },
    isDragOver: false,
  }),
}))

describe('FormCanvas', () => {
  beforeEach(() => {
    useFormBuilderStore.setState({
      formId: '',
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
      itemIds: [],
    })
    render(<FormCanvas />)
    expect(screen.getByText('Drag & Drop fields here')).toBeInTheDocument()
  })

  it('renders canvas item renderers when form has fields', () => {
    useFormBuilderStore.setState({
      formId: '1',
      formTitle: 'Test Form',
      itemIds: ['f1'],
      itemsData: {
        f1: { id: 'f1', type: 'text', label: 'Field 1', kind: 'field' },
      },
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-canvas-item-renderer')).toHaveTextContent('f1')
  })

  it('renders preview mode when previewMode is true and schema exists', () => {
    useFormBuilderStore.setState({
      formId: '1',
      formTitle: 'Test Form',
      itemIds: [],
      previewMode: true,
    })
    render(<FormCanvas />)
    expect(screen.getByTestId('mock-preview-form-renderer')).toBeInTheDocument()
  })
})
