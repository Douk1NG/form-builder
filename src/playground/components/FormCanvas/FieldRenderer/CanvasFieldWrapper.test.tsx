import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasFieldWrapper } from './CanvasFieldWrapper'

vi.mock('@/playground/hooks/useEdgeDraggable', () => ({
  useEdgeDraggable: () => ({
    elementRef: { current: null },
    dragHandleRef: { current: null },
    isDragging: false,
    isDragOver: false,
    closestEdge: null,
  }),
}))

vi.mock('@/playground/hooks/useCanvasFieldWrapper', () => ({
  useCanvasFieldWrapper: () => ({
    isLeftEdge: false,
    isRightEdge: false,
    draggingClassName: '',
    borderClass: 'border-border/40 bg-card/60 hover:border-border/60 hover:bg-card/80',
    handleOnKeyDown: (event: React.KeyboardEvent, onSelect: () => void) => {
      if (event.key === 'Enter' || event.key === ' ') onSelect()
    },
  }),
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

  it('calls onSelect when the wrapper is clicked', async () => {
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

  it('calls action handlers when toolbar buttons are clicked', async () => {
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

    const buttons = screen.getAllByRole('button')
    // [0] = wrapper div (role="button"), [1] = drag handle, [2] = ArrowUp, [3] = ArrowDown, [4] = Trash
    await user.click(buttons[2])
    expect(onMoveUp).toHaveBeenCalled()

    await user.click(buttons[3])
    expect(onMoveDown).toHaveBeenCalled()

    await user.click(buttons[4])
    expect(onRemove).toHaveBeenCalled()
  })
})
