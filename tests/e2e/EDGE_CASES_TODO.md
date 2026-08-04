# E2E Edge Cases — TODO

Deferred edge cases discovered during happy-path test development.  
Each item references the use case it belongs to.

---

## UC1: First Load

- [ ] **Cancel dialog on first load:** Close the "Create Form" dialog without entering a name. Verify nothing breaks and the empty state persists.
- [ ] **Create untitled form:** Submit the dialog with an empty name. Verify the form is created with a default title (e.g. "Untitled Form").

## UC2: Palette Selection

- [ ] **Drag and drop from palette:** Drag a field from the palette onto the canvas drop zone. Requires a custom Playwright helper dispatching `dragstart`/`dragover`/`drop` events since native `dragTo` doesn't work with `@atlaskit/pragmatic-drag-and-drop`.
- [ ] **Add multiple fields:** Click several different field types and verify they all appear in order on the canvas.
- [ ] **Add duplicate field types:** Click the same field type twice and verify two separate instances are created.

## UC3: Field Properties

- [ ] **Localization toggle:** Click the "Translate" button on a LocalizedInput. Verify one input per supported locale appears (driven by `SUPPORTED_LOCALES.length`, not hardcoded). This behavior may change as more languages are added.
- [ ] **Data tab disabled for non-option fields:** Verify the Data tab is disabled for Text, Textarea, Number, Currency, Switch, Tagbox, and Image Uploader fields.
- [ ] **Tagbox options support:** `hasOptions` in `FieldProperties.tsx` only covers `select`/`multiselect`. If tagbox should support options, this is a bug to fix and test.

## UC4: Preview Form

- [ ] **Fill all field types in preview:** Current test only fills Text and Textarea. Add coverage for Number, Currency, Switch, Select, Multi Select, Tagbox, and Image Uploader inputs.
- [ ] **Device size toggle:** Switch between Desktop, Tablet, and Mobile in preview mode and verify the frame resizes.
- [ ] **Locale switcher in preview:** Switch locale and verify localized labels render correctly.
- [ ] **Submit form in preview:** Click the submit button and verify the simulated submit response.

## UC5: Export JSON

- [ ] **Export with all field types:** Add every field type to the canvas, configure them, and verify the JSON contains all of them.
- [ ] **Export with field groups:** Add fields inside a group and verify the nested structure in the exported JSON.
- [ ] **Export filename:** Verify the downloaded file is named `{formTitle}.json`.

## UC6: Canvas Operations (not started)

- [ ] **Reorder fields on canvas**
- [ ] **Delete a field from canvas**
- [ ] **Move field up / move field down buttons**

## UC7: Form Management (not started)

- [ ] **Switch between multiple forms**
- [ ] **Delete a form**
- [ ] **Rename a form**

