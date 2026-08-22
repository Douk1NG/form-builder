import { describe, it, expect, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FieldPalette } from './FieldPalette'
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
    expect(screen.getByText('Fields')).toBeInTheDocument()
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
    const item = state.itemsData[itemId]
    const isField = item.kind === 'field'
    expect(isField).toBe(true)
    if (isField) {
      expect(item.type).toBe('text')
    }
  })

  it('allows layout buttons when locked group is a 2-column row', () => {
    // Add a 2-column row group and lock it
    useFormBuilderStore.setState({
      lockedGroupId: 'row-1',
      itemsData: {
        'row-1': { id: 'row-1', kind: 'field_group', label: '', columns: 2, items: [] }
      }
    })

    render(<FieldPalette />)

    // The Group and 2 Column buttons under layout should be enabled (nesting is now allowed)
    const groupButton = screen.getByText('Field Group').closest('button')
    const rowButton = screen.getByText('2 Columns').closest('button')

    expect(groupButton).toBeEnabled()
    expect(rowButton).toBeEnabled()
  })
})
