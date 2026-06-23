# Form Builder Future Features

This document tracks upcoming features and enhancements for the form builder that are planned for future iterations.

## Advanced Logic & Flow
- **Conditional Logic (Rule Builder):** Visually build rules to show/hide fields based on previous answers (e.g., *If [Field A] equals [Value], then Show [Field B]*).
- **Multi-step Forms:** Allow breaking long forms into multiple pages with "Next" and "Previous" navigation.
- **Calculated Fields:** Fields whose values are automatically computed based on inputs from other fields.

## Field Enhancements
- **Advanced Validation Rules:** Regex support, custom error messages, and cross-field validation (e.g., password confirmation must match).
- **Custom Submit Button:** Allow placing the Submit button anywhere on the canvas, renaming it, and changing its styling (alignment, colors).

## UI/UX Polish
- **Undo / Redo System:** Implement full history tracking for form edits with keyboard shortcut support (Ctrl+Z / Cmd+Z).
- **Inline Editing:** Allow clicking directly on field labels on the canvas to edit them without opening the properties sidebar.
- **Real-time Validation Checking:** Highlight empty dropdown configurations or missing required settings *before* the user tries to publish.

## Integrations & Export
- **Webhooks & Integrations:** Connect the form to external services (Slack, Google Sheets, Zapier) upon submission.
- **Embed Codes:** Generate snippet codes (iframe, React component, or vanilla JS) to easily embed the published form anywhere.
