# Form Builder — Agent Rules & Project Context

This file serves two purposes: (1) defines mandatory development rules for all agents, and (2) provides a structured report of the project architecture so new agents can get context fast.

---

## Part 1: Development Rules — TDD Testing Strategy

These rules apply from now on to **every** code change in this repository. No exceptions.

### Rule T1: Bug-First Testing
Every bug fix **must** start with a failing test that reproduces the bug. Write the test first, watch it fail, then write the fix that makes it pass. A bug fix without a regression test is not complete.

### Rule T2: Test-First for New Features
All new features follow the **red → green → refactor** cycle:
1. Write a failing test that describes the expected behavior.
2. Write the minimum code to make the test pass.
3. Refactor without breaking the test.

### Rule T3: Test Co-location
Unit and integration tests live **next to their source files**, not in a separate directory:
- `FieldPalette.tsx` → `FieldPalette.test.tsx` (same folder)
- `useFormCanvas.ts` → `useFormCanvas.test.ts` (same folder)

E2E tests (Playwright) live in `tests/e2e/`.

### Rule T4: No Untested Logic
Hooks, utility functions, and store slices **must** have corresponding test files. Components must have tests covering user-visible behavior. If a file has logic, it has tests.

### Rule T5: Test Naming as Specification
Use descriptive `describe`/`it` blocks that read as behavioral specifications:
```typescript
describe('useFormBuilderStore — createNewForm', () => {
  it('generates a unique form id and sets the title', () => { ... })
  it('saves the current form before creating a new one', () => { ... })
})
```

### Rule T6: No `as any` in Tests
Test files follow the **exact same TypeScript rules** as production code. `any` is forbidden. `as unknown as T` is forbidden. Use proper types, type guards, or `Partial<>` / `Omit<>` to construct test data.

### Rule T7: Run Tests Before Completing Work
Always run `npm run test` and confirm **all tests pass** before considering work complete. If a test breaks, fix it — do not skip it.

### Rule T8: Frameworks
- **Unit & Integration tests:** Vitest + React Testing Library
- **E2E tests:** Playwright
- **Test setup file:** `tests/setup.ts`

### Rule T9: Running Tests
```bash
npm run test          # Run all unit/integration tests once
npm run test:watch    # Watch mode during development
npm run test:ui       # Vitest UI
npm run test:e2e      # Playwright E2E tests
```

---

## Part 2: Project Architecture Report

> **Read-only reference.** This section describes the project structure, build pipeline, and key patterns. Do not modify source code based on this section alone — it exists to orient agents quickly.

### Overview

**form-builder** is a React + TypeScript project with two distinct halves:

| Concern | Description | Entry Point |
|---|---|---|
| **Core Library** | Schema-driven form renderer, exported as a reusable package | `src/index.ts` |
| **Playground** | Interactive drag-and-drop form builder UI (the active dev focus) | `src/main.tsx` → `src/App.tsx` → `src/playground/Playground.tsx` |

The project is served by **Vite** (dev server on `localhost:5173`) and built with **TypeScript** (`tsc`). The library is not yet published — `package.json` has `"private": true`.

### Technology Stack

| Category | Technology | Version |
|---|---|---|
| Runtime | React | 19.x |
| Language | TypeScript | 6.x |
| Bundler / Dev Server | Vite | 8.x |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`) + `tailwind-merge` + `class-variance-authority` |
| State Management | Zustand (with `persist` middleware) | 5.x |
| Drag & Drop | `@atlaskit/pragmatic-drag-and-drop` | 2.x |
| UI Primitives | Radix UI (dialog, select, switch, tabs, label, slot) |
| Internationalization | i18next + react-i18next + browser language detector |
| Unit Testing | Vitest + React Testing Library + jsdom | 4.x |
| E2E Testing | Playwright | 1.x |

### Directory Structure

```
form-builder/
├── index.html                    ← Vite HTML entry (mounts #app)
├── vite.config.ts                ← Vite config (@ alias)
├── vitest.config.ts              ← Vitest config (jsdom, setup file)
├── playwright.config.ts          ← Playwright config (tests/e2e, port 5173)
├── tsconfig.json                 ← TypeScript config (bundler resolution, @ paths)
├── package.json                  ← Scripts, dependencies
├── postcss.config.cjs            ← PostCSS with @tailwindcss/postcss + autoprefixer
├── tailwind.config.cjs           ← Tailwind content paths
├── tests/
│   ├── setup.ts                  ← Vitest setup (imports @testing-library/jest-dom)
│   └── e2e/
│       └── playground.spec.ts    ← Playwright E2E skeleton
│
├── src/
│   ├── main.tsx                  ← React root (StrictMode → App)
│   ├── App.tsx                   ← Renders <Playground />
│   ├── index.ts                  ← Library export barrel (FormBuilder, types, hooks)
│   ├── index.css                 ← Global styles / Tailwind base
│   │
│   ├── types/                    ← Shared type definitions
│   │   ├── form.ts               ← Core domain types (Field, CanvasField, FieldGroup, CanvasItem, FormProps)
│   │   ├── i18n.ts
│   │   ├── image-uploader.ts
│   │   ├── select.ts
│   │   └── tagbox.ts
│   │
│   ├── utils/                    ← Shared utilities
│   │   ├── locales.ts            ← resolveLocalizedString, SUPPORTED_LOCALES
│   │   ├── file.ts               ← formatFileSize, isValidFileType
│   │   ├── file.test.ts          ← Co-located unit test
│   │   ├── safeParse.ts          ← safeParseFloat, safeParseNumber, safeParseBoolean, safeParseJSON
│   │   └── translations/
│   │
│   ├── lib/
│   │   ├── i18n.ts               ← i18next initialization (en + es)
│   │   └── utils.ts              ← cn() (clsx+twMerge), cleanSplit, getBasePath, etc.
│   │
│   ├── context/
│   │   └── InheritanceProvider.tsx ← React context for field inheritance (getFieldValue + onChange)
│   │
│   ├── hooks/                    ← Core library hooks
│   │   ├── use-form-state.ts
│   │   ├── use-form-fields.ts
│   │   ├── use-carrousel.ts
│   │   ├── use-field-inheritance.ts
│   │   ├── use-image-uploader.ts
│   │   └── use-tagbox.ts
│   │
│   ├── locales/                  ← Translation JSON files
│   │   ├── en/
│   │   └── es/
│   │
│   ├── components/
│   │   ├── form/                 ← CORE: Schema-driven form renderer
│   │   │   ├── index.tsx         ← FormBuilder component (the main export)
│   │   │   ├── field.tsx         ← Field dispatcher (routes by field.type)
│   │   │   ├── alert.tsx         ← Form error alert
│   │   │   ├── submit.tsx        ← Submit button
│   │   │   ├── field-error.tsx   ← Field-level error display
│   │   │   └── components/      ← Per-type field renderers
│   │   │       ├── text/
│   │   │       ├── textarea/
│   │   │       ├── select/
│   │   │       ├── multiselect/
│   │   │       ├── currency/
│   │   │       ├── number/
│   │   │       ├── switch/
│   │   │       ├── tagbox/
│   │   │       ├── image-uploader/
│   │   │       └── group/
│   │   │
│   │   └── ui/                   ← Reusable UI primitives (Radix-based)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── textarea.tsx
│   │       ├── select.tsx
│   │       ├── dialog.tsx
│   │       ├── switch.tsx
│   │       ├── tabs.tsx
│   │       └── alert.tsx
│   │
│   └── playground/               ← PLAYGROUND: Interactive form builder
│       ├── Playground.tsx        ← Root layout (Header + Palette + Canvas + Properties)
│       │
│       ├── store/                ← Zustand store (persisted to localStorage)
│       │   ├── useFormBuilderStore.ts   ← Combined store (3 slices)
│       │   ├── BuilderPersistence.ts    ← Persist config + partialize
│       │   ├── CanvasItemTree.ts        ← Tree traversal utilities (update/remove nested fields)
│       │   └── slices/
│       │       ├── FormDocuments.ts     ← Multi-form CRUD (create, switch, delete, updateTitle)
│       │       ├── CanvasItems.ts       ← Canvas item state + getFormSchema
│       │       ├── BuilderUI.ts         ← UI state (selectedItem, previewMode, locale, device)
│       │       └── Canvas/
│       │           ├── CanvasListActions.ts  ← Flat list ops (add, remove, reorder, insert, move)
│       │           └── CanvasGroupActions.ts ← Group ops (update, merge, createFromDrop, etc.)
│       │
│       ├── hooks/                ← Playground-specific hooks (18 files)
│       │   ├── usePlayground.ts
│       │   ├── usePlaygroundLayout.ts
│       │   ├── useFormCanvas.ts
│       │   ├── useFieldPalette.ts
│       │   ├── useFieldProperties.ts
│       │   ├── useFieldOptionsEditor.ts
│       │   ├── useCanvasDropTarget.ts
│       │   ├── useCanvasFieldWrapper.ts
│       │   ├── useEdgeDraggable.ts
│       │   ├── useFieldGroupRenderer.ts
│       │   ├── useFieldGroupRendererCard.ts
│       │   ├── useFieldRenderer.ts
│       │   ├── useFormSwitcher.ts
│       │   ├── useGroupDropZone.ts
│       │   ├── useGroupFieldItem.ts
│       │   ├── useLocaleSwitcher.ts
│       │   ├── useLocalizedInput.ts
│       │   └── usePaletteItemDrag.ts
│       │
│       ├── components/           ← Playground UI components
│       │   ├── AmbientBackground.tsx
│       │   ├── NoFormSelectedPlaceholder.tsx
│       │   ├── FieldPalette/     ← Left sidebar (field type buttons)
│       │   │   ├── FieldPalette.tsx
│       │   │   ├── FieldSection.tsx
│       │   │   ├── LayoutSection.tsx
│       │   │   └── PaletteItem.tsx
│       │   ├── FormCanvas/       ← Center panel (drop target + field rendering)
│       │   │   ├── FormCanvas.tsx
│       │   │   ├── CanvasItemRenderer.tsx
│       │   │   ├── EmptyCanvasPlaceholder.tsx
│       │   │   ├── PreviewFormRenderer.tsx
│       │   │   ├── FieldRenderer/
│       │   │   │   ├── FieldRenderer.tsx
│       │   │   │   ├── CanvasFieldWrapper.tsx
│       │   │   │   └── FieldActionToolbar.tsx
│       │   │   └── FieldGroupRenderer/
│       │   │       ├── FieldGroupRenderer.tsx
│       │   │       ├── GroupDropZone.tsx
│       │   │       └── GroupFieldItem.tsx
│       │   ├── FieldProperties/  ← Right sidebar (property editor)
│       │   │   ├── FieldProperties.tsx
│       │   │   ├── FieldBasicTab.tsx
│       │   │   ├── FieldBehaviorTab.tsx
│       │   │   ├── FieldDataTab.tsx
│       │   │   ├── FieldOptionsEditor.tsx
│       │   │   ├── GroupPropertiesPanel.tsx
│       │   │   ├── EmptyPropertiesPanel.tsx
│       │   │   ├── LabeledSwitchRow.tsx
│       │   │   ├── LocalizedInput.tsx
│       │   │   └── PropertiesSectionHeader.tsx
│       │   └── PlaygroundHeader/ ← Top bar (form switcher, preview toggle, device, locale)
│       │       ├── PlaygroundHeader.tsx
│       │       ├── FormSwitcher.tsx
│       │       ├── FormSwitcherSelect.tsx
│       │       ├── FormBuilderLogo.tsx
│       │       ├── DeviceToggleButton.tsx
│       │       └── LocaleSwitcher.tsx
│       │
│       ├── types/
│       │   └── dragDropTypes.ts  ← PaletteDragData, CanvasDragData, CanvasDropData + type guards
│       │
│       ├── constants/
│       │   └── edgeConstants.ts
│       │
│       └── utils/
│           ├── handleCanvasDrop.ts         ← Central drop handler (palette→canvas, canvas→canvas)
│           ├── findItemById.ts             ← Recursive item lookup in nested groups
│           ├── canvasFieldWrapperStyles.ts
│           ├── deviceToggleOptions.ts
│           ├── fieldTypeOptions.ts
│           └── previewFrameConfig.ts
```

### Build & Dev Pipeline

| Command | What it does |
|---|---|
| `npm run dev` | Starts Vite dev server on `http://localhost:5173`. Serves `index.html` which loads `src/main.tsx` → renders the Playground. |
| `npm run build` | Runs `tsc -p tsconfig.json`. Compiles `src/` → `dist/` with declarations. This is a **library build** (no Vite bundle), meant for the core library export. |
| `npm run preview` | Serves the Vite production build for local preview. |
| `npm run test` | `vitest run` — runs all `*.test.*` files under `src/` once. |
| `npm run test:watch` | `vitest` — watch mode for TDD development loop. |
| `npm run test:ui` | `vitest --ui` — opens the Vitest browser UI. |
| `npm run test:e2e` | `playwright test` — runs E2E tests in `tests/e2e/`. |

### Key Architecture Patterns

#### Path Alias
`@` maps to `./src` in both `tsconfig.json` and `vite.config.ts`. Tests must also resolve this alias (see vitest config).

#### State Management (Zustand)
The playground uses a single Zustand store (`useFormBuilderStore`) composed from **3 slices**:
1. **FormDocuments** — multi-form CRUD (create, switch, delete, rename)
2. **CanvasItems** — the flat `itemIds[]` + `itemsData{}` structure, plus `getFormSchema()`
3. **BuilderUI** — UI-only state (selectedItem, previewMode, locale, device)

The store is persisted to `localStorage` via `zustand/middleware/persist`.

Canvas items use a **flat map + ordered ID array** pattern: `itemIds: string[]` for order, `itemsData: Record<string, CanvasItem>` for data. Groups contain nested items inline.

#### Core Type Hierarchy
```
Field (union of TextField | SelectField | ...)
  └─ CanvasField = Field & { id: string; kind: 'field' }

FieldGroup = { id, kind: 'field_group', label?, columns?, items: (CanvasField | FieldGroup)[] }

CanvasItem = CanvasField | FieldGroup   ← top-level canvas items
```

The `kind` discriminant (`'field'` vs `'field_group'`) enables runtime type narrowing.

#### Drag & Drop
Uses `@atlaskit/pragmatic-drag-and-drop` with custom data types:
- `PaletteDragData` — dragging from the field palette (new field creation)
- `CanvasDragData` — dragging existing fields within the canvas
- `CanvasDropData` — the drop target metadata (position, group, edge)

The central orchestrator is `handleCanvasDrop()` which routes to the appropriate store action.

#### Internationalization
- **Playground UI text:** `i18next` + `react-i18next` with JSON translation files in `src/locales/{en,es}/`
- **Form field labels:** `LocalizedString` type (`string | Record<string, string>`) resolved at render time via `resolveLocalizedString(value, locale)`

#### Library Exports (`src/index.ts`)
The core library exports:
- `FormBuilder` component (the schema-driven renderer)
- All form types (`Field`, `CanvasItem`, `FormProps`, `ActionResponse`, etc.)
- `useFormState` hook
- `resolveLocalizedString` + `SUPPORTED_LOCALES`
- `SupportedLocale` type

### Current Test Coverage

> **⚠️ IMPORTANT FOR AGENTS:** This section MUST be updated whenever you add or modify tests to prevent misinformation.

| File | Type | Location |
|---|---|---|
| `src/utils/file.test.ts` | Unit (utility) | ✅ Co-located |
| `src/playground/store/useFormBuilderStore.test.ts` | Unit (store) | ✅ Co-located |
| `src/playground/components/FormCanvas/FieldRenderer/CanvasFieldWrapper.test.tsx` | Component | ✅ Co-located |
| `src/playground/components/FieldPalette/FieldPalette.test.tsx` | Component | ✅ Co-located |
| `src/playground/components/FormCanvas/FormCanvas.test.tsx` | Component | ✅ Co-located |
| `tests/e2e/playground.spec.ts` | E2E (skeleton) | ⚠️ Placeholder only |

### Testing Gaps (Priority Targets)

These areas have **zero test coverage** and are the most bug-prone:
1. **`handleCanvasDrop.ts`** — the central drop handler; complex branching logic
2. **Store slices** — `CanvasListActions`, `CanvasGroupActions` (only the combined store has tests)
3. **`CanvasItemTree.ts`** — recursive tree traversal (update/remove nested fields)
4. **`findItemById.ts`** — recursive item lookup
5. **`resolveLocalizedString`** — locale resolution with fallback chain
6. **All playground hooks** — 18 hooks with zero tests
7. **`safeParse.ts`** — parsing utilities
