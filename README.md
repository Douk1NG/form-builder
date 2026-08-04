# form-builder

# Reported bugs - FORM
- Cuando deselecciono una categoria en productos, los elementos seleccionados no se deseleccionan (se debe conservar la selección de filtros que prevalezca según el caso)

- Validacion de
- Imagen principal en editar no se adjunta

# Reported bugs - Playground

- **UC1 (First load):** When entering the page with no forms in storage, it automatically opens a dialog asking for a form name.
  - *Current Status:* **Passing**. The happy path successfully creates the form. (Edge case: testing cancellation logic is deferred).

- **UC2 (Palette clicking):** Clicking field options in the palette should add them directly to the canvas.
  - *Current Status:* **Passing**. Clicking palette buttons successfully adds items to the canvas.
  - *TODO:* Edge case testing for drag-and-drop from the palette is deferred due to Playwright native event limitations.

- **UC3 (Field Properties):** Selecting a field allows defining properties in the right sidebar.
  - *Current Status:* **Passing**. All field-specific property tabs (Basic, Behavior, and Data/Options) for every field type successfully accept input and update their respective fields.

- **UC4 (Preview Form):** Toggle preview mode, verify fields render with configured labels, fill the form, return to edit mode.
  - *Current Status:* **Passing**. Preview renders all configured fields, inputs are fillable, and toggling back to edit mode restores the canvas.

- **UC5 (Export JSON):** Click Export JSON and verify the downloaded file contains all configured properties.
  - *Current Status:* **Passing**. Exported schema includes form title, field types, labels, placeholders, descriptions, names, readOnly flags, and options.
