# Playground Code Review — Task Tracker

## Phase 1: Shared Components
- [x] Create `EdgeIndicators.tsx`
- [x] Create `DragHandle.tsx`
- [x] Create `GroupActionToolbar.tsx`
- [x] Refactor `CanvasFieldWrapper.tsx` to use shared components
- [x] Refactor `GroupFieldItem.tsx` to use shared components
- [x] Refactor `FieldGroupRenderer.tsx` to use shared components (target <150 lines)

## Phase 2: Hook & Component Rule 1 Fixes
- [x] Move `itemsData` + `canvasItems` into `useFormCanvas.ts`, update `FormCanvas.tsx`
- [x] Move `isPropertiesExpanded` + `togglePropertiesExpanded` into `useFieldProperties.ts`, update `FieldProperties.tsx`
- [x] Move `previewDevice` + `setPreviewDevice` into `usePlayground.ts`, remove dead code, update `PlaygroundHeader.tsx`

## Phase 3: Type Safety Improvements
- [x] Add `NewFieldInput` type to `form.ts`
- [x] Fix `useFieldProperties.ts` — remove `as string` casts
- [x] Fix `useEdgeDraggable.ts` — use type guards
- [x] Fix `useGroupDropZone.ts` — use type guards
- [x] Replace `Omit<Field, 'id'>` with `NewFieldInput` across store + utils

## Phase 4: Constants & Magic Strings
- [x] Create `fieldDefaults.ts` with `DEFAULT_GROUP_LABEL`, `DEFAULT_TWO_COLUMN_COUNT`, `FIELD_ID_SUFFIX_LENGTH`
- [x] Update all 5+ locations using magic strings

## Phase 5: Store Refactoring
- [x] Create `CanvasItemTreeMerge.ts` — split from `CanvasItemTree.ts`
- [x] Extract `findAndUpdateInTree` helper into `CanvasItemTree.ts`
- [x] Fix `tryAddNestedGroupItem` mutation
- [x] Create `CanvasGroupCreation.ts` — split from `CanvasGroupActions.ts`
- [x] Update imports across codebase

## Phase 6: Minor Cleanup
- [x] Fix `@ts-expect-error` in `PreviewFormRenderer.tsx`

## Verification
- [x] `npm run test` — all tests pass
- [x] `npx tsc --noEmit` — zero errors
