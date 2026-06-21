import { describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldPalette } from '../FieldPalette'
import { useFormBuilderStore } from '../../store/useFormBuilderStore'

describe('FieldPalette', () => {
  beforeEach(() => {
    useFormBuilderStore.setState({
      formId: '1',
      previewMode: false,
      itemIds: [],
      itemsData: {},
    })
  })

  it('renders nothing in preview mode', () => {
    useFormBuilderStore.setState({ previewMode: true })
    const { container } = render(<FieldPalette />)
    expect(container.firstChild).toBeNull()
  })

  it('renders field options when not in preview mode', () => {
    render(<FieldPalette />)
    expect(screen.getByText('Form Fields')).toBeInTheDocument()
    expect(screen.getByText('Text Input')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
  })

  it('adds a field when clicking a palette item', async () => {
    const user = userEvent.setup()
    render(<FieldPalette />)

    await user.click(screen.getByText('Text Input'))

    const state = useFormBuilderStore.getState()
    expect(state.itemIds).toHaveLength(1)

    const itemId = state.itemIds[0]
    expect((state.itemsData[itemId] as any).type).toBe('text')
  })
})
