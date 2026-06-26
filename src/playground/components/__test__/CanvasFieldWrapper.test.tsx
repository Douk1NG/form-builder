import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasFieldWrapper } from '../FormCanvas/FieldRenderer/CanvasFieldWrapper'

// Mock icons
vi.mock('lucide-react', () => ({
  ArrowUp: () => <div data-testid="arrow-up" />,
  ArrowDown: () => <div data-testid="arrow-down" />,
  Trash2: () => <div data-testid="trash" />,
  GripVertical: () => <div data-testid="grip" />
}))

describe('CanvasFieldWrapper', () => {
  const defaultProps = {
    id: 'test-field',
    index: 0,
    isSelected: false,
    onSelect: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    onRemove: vi.fn(),
  }

  it('renders children correctly', () => {
    render(
      <CanvasFieldWrapper {...defaultProps}>
        <div data-testid="child-content">Child</div>
      </CanvasFieldWrapper>
    )
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <CanvasFieldWrapper {...defaultProps} onSelect={onSelect}>
        <div>Child</div>
      </CanvasFieldWrapper>
    )

    await user.click(screen.getByRole('button', { name: /child/i }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('renders with selected styling when isSelected is true', () => {
    render(
      <CanvasFieldWrapper {...defaultProps} isSelected={true}>
        <div>Child</div>
      </CanvasFieldWrapper>
    )
    const wrapper = screen.getByRole('button', { name: /child/i })
    expect(wrapper).toHaveClass('border-primary/60')
    expect(wrapper).toHaveClass('ring-primary/15')
  })

  it('calls action handlers when buttons are clicked', async () => {
    const user = userEvent.setup()
    const onMoveUp = vi.fn()
    const onMoveDown = vi.fn()
    const onRemove = vi.fn()

    render(
      <CanvasFieldWrapper
        {...defaultProps}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
      >
        <div>Child</div>
      </CanvasFieldWrapper>
    )

    // The buttons are hidden until hover, but screen.getByRole finds them. 
    // They are rendered, just with opacity-0 class from parent group.
    const buttons = screen.getAllByRole('button')
    // Grip is [0], Canvas wrapper is [1], ArrowUp is [2], ArrowDown is [3], Trash is [4]

    await user.click(buttons[2])
    expect(onMoveUp).toHaveBeenCalled()

    await user.click(buttons[3])
    expect(onMoveDown).toHaveBeenCalled()

    await user.click(buttons[4])
    expect(onRemove).toHaveBeenCalled()
  })
})
