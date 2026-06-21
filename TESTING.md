# Testing Strategy & Implementation Guide

This document outlines the testing strategy for `form-builder`. We use a combination of Unit/Integration tests and End-to-End (E2E) tests to ensure the reliability and correctness of our components and application flows.

## Frameworks

- **Unit & Integration Tests**: [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **End-to-End (E2E) Tests**: [Playwright](https://playwright.dev/)

## Folder Structure

We follow the principle of co-locating tests with their corresponding source files to make it easy to find and update tests alongside features.

```text
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx      <-- Unit/Integration test
  hooks/
    useForm.ts
    useForm.test.ts        <-- Unit test
tests/
  e2e/                     <-- Playwright E2E tests
    playground.spec.ts
```

## Running Tests

### Unit and Integration Tests (Vitest)
```bash
# Run tests once
npm run test

# Run tests in watch mode (ideal during development)
npm run test:watch

# Run tests with UI
npm run test:ui
```

### E2E Tests (Playwright)
```bash
# Run E2E tests in headless mode
npx playwright test

# Run E2E tests in UI mode for debugging
npx playwright test --ui
```

## Guidelines for Writing Tests

### 1. Components (React Testing Library)
- **Test User Behavior, Not Implementation**: Avoid testing internal state directly. Test what the user sees (DOM nodes) and interacts with (clicks, typing).
- **Use the right queries**: Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId` to ensure accessibility is also verified implicitly.
- **Example**:
  ```tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import { Button } from './Button';

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  ```

### 2. Hooks and Utilities
- For pure utility functions, write straightforward input/output unit tests.
- For hooks, use `@testing-library/react`'s `renderHook` if the hook uses React context or complex lifecycle methods.

### 3. E2E Tests (Playwright)
- Focus on critical user flows across the application.
- E2E tests are slower; avoid testing edge cases here that can be covered by Unit/Integration tests.
- **Example Flow**: User opens the playground, drags a text input to the canvas, fills it out, and submits the form.
