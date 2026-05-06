# Payload Visual Editor — Ubiquitous Language & Context

## Domain

This is a **Payload CMS plugin** that adds inline visual editing to front-end pages. Authenticated users in draft/preview mode can click annotated DOM elements, edit their text content, and save or publish changes directly from the page.

## Key Terms

### Source Map
A flat `Record<string, string>` mapping dot-notation Payload field paths to their current string values. Built by `buildSourceMap()` from Payload field definitions + document data. Only includes `text` and `textarea` field types. Drives `createEditableAttrs()`.

### Editable Attributes
HTML attributes produced by `createEditableAttrs(sourceMap)`. Returns a function that maps a field path to `{ 'data-payload-path': path }` when the path exists in the source map, or `{}` otherwise. Spread onto elements: `<h1 {...editable('title')}>`.

### Payload Field Identification
`identifyPayloadField(element)` — walks up the DOM from a clicked element to find the nearest `[data-payload-path]` attribute, returning `{ name, path }`. Extracted to `src/utils/payload-field-identification.ts`.

### Patch
A `{ path, value }` pair where `path` is a dot-notation field path and `value` is the replacement string. Patches are generated from annotations via `generatePatches()`, validated and applied by `applyPatchesToDocument()` and `buildPatchedUpdateData()`.

### Save vs Publish
- **Save**: Persists changes as a draft update (only affects the draft version, published version unchanged).
- **Publish**: Sets `_status: 'published'` on the update, making changes live. Only available on draft-enabled collections.

### Annotation
A structured object capturing a user's edit intent on a DOM element. Contains the element's identity, bounding box, styles, accessibility info, and the linked PayloadCMS field (`payloadCMS.path` + `payloadCMS.value`).

### Pending Annotation
Intermediate state during annotation creation, before the user submits a comment. Includes live DOM references (`targetElement`, `multiSelectElements`) that are stripped when finalized.

### buildAnnotation
Pure function extracted from the toolbar. Transforms a `PendingAnnotation` + comment string into a finalized `Annotation`. Does not include server sync metadata — the caller adds that context.

### Auth & Preview Gating
Edits are only available to authenticated users who are in Payload's draft/preview mode. Outside preview, elements have no `data-payload-path` attributes and the toolbar doesn't mount.

## Architecture

```
Payload Query (context: { contentSourceMap: true })
  → _sourceMap field populated via afterRead hook
  → createEditableAttrs(page._sourceMap) returns { 'data-payload-path': path } attrs
  → Spread on HTML elements: <h1 {...editable('title')}>
  → VisualEditorToolbar reads data-payload-path attributes
  → Click-to-edit creates PendingAnnotation with payloadCMS.path
  → buildAnnotation finalizes the annotation
  → Save/Publish sends patches to POST /api/payload-visual-editor
```

## Test Structure

- **Unit tests**: Collocated with source (`src/utils/*.test.ts`)
- **Integration tests**: `tests/integration/`
- **E2E tests**: `tests/e2e/`

## Decisions

- `isAllowedEditablePath` and the `editablePaths` prop have been removed — field editability is determined by source map + auth/preview mode, not an allowlist.
- `localPreviewState.ts` is removed.
- `buildAnnotation` is a pure function (no `window`, no network, no sync metadata).
- `identifyPayloadField` extracted from toolbar to `src/utils/payload-field-identification.ts`.