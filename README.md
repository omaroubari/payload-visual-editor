# Payload Visual Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Edit CMS content directly on your live pages. Annotate everything else.

**Payload Visual Editor** eliminates the round-trip between your frontend and the admin panel. Content editors click and edit text fields right where they appear on the page. For elements that live in code (layout, styling, components), switch to annotation mode — place visual markers with comments and send the feedback to your developers, GitHub issues, or an AI agent via webhooks.

## Features

- **Inline Content Editing** — Click any CMS-managed text field on your page to edit, save as draft, or publish without ever opening the admin panel *(text fields only — other fields coming soon)*
- **Visual Annotation Mode** — Place numbered markers anywhere on the page — perfect for elements that live in code rather than your CMS
- **Route Feedback Anywhere** — Export annotations as markdown, send them to a webhook (GitHub issues, CI pipelines, dev notifications), or connect to an AI agent via MCP (coming soon)
- **Draft-Aware** — Full integration with Payload's draft mode, including save and publish from the toolbar
- **React Component Detection** — Annotate with React component paths in development mode
- **Draggable & Customizable** — Repositionable toolbar, dark/light theme, 7 marker colors, keyboard shortcuts (`Cmd+Shift+F` to toggle)
- **Per-Collection Configuration** — Enable or disable editing per Payload collection

## Demo
https://github.com/user-attachments/assets/746a7f89-88c8-44b0-87ff-1c53a08c028f

## Installation

```bash
npm install payloadcms-visual-editor
# or
pnpm add payloadcms-visual-editor
# or
yarn add payloadcms-visual-editor
```

### Requirements

- Payload CMS 3.x
- Draft mode configured on your collections

> **Note:** The visual editor requires Payload's [draft mode](https://payloadcms.com/docs/versions/drafts) to be enabled. When fetching documents, pass `contentSourceMap: true` in the query `context` to populate the `_sourceMap` field.

## Quick Start

### 1. Add the plugin to your Payload config

```ts
// payload.config.ts
import { payloadVisualEditor } from 'payloadcms-visual-editor'

export default buildConfig({
  plugins: [
    payloadVisualEditor({
      collections: {
        pages: true,
        posts: true,
      },
    }),
  ],
})
```

### 2. Mark your frontend elements as editable

Use the `createEditableAttrs` helper to extract editable paths from the `_sourceMap` field, then spread the attributes on your elements.

```tsx
// app/(frontend)/[slug]/page.tsx
import { getPayload } from 'payload'
import { createEditableAttrs } from 'payloadcms-visual-editor'

export default async function Page({ params }) {
  const payload = await getPayload({ config: configPromise })

  const pageResult = await payload.find({
    collection: 'pages',
    context: {
      contentSourceMap: true,
    },
    draft: true,
    limit: 1,
  })

  const page = pageResult.docs[0]
  const editable = createEditableAttrs(page._sourceMap)

  return (
    <main>
      <h1 {...editable('title')}>{page.title}</h1>
      <p {...editable('description')}>{page.description}</p>
    </main>
  )
}
```

### 3. Mount the toolbar on your page

```tsx
import { VisualEditorToolbar } from 'payloadcms-visual-editor/client'

{
  draft && page._sourceMap ? (
    <VisualEditorToolbar
      documentInfo={{
        id: page.id,
        collection: 'pages',
        hasDrafts: true,
      }}
      editablePaths={Object.keys(page._sourceMap)}
    />
  ) : null
}
```

### 4. Start editing

Visit any draft page on your frontend. The toolbar appears at the bottom of the viewport. Click any editable element to edit it inline, or switch to annotation mode to leave visual feedback.

## Configuration

### Plugin Options

```ts
payloadVisualEditor({
  collections: {
    // Keys are collection slugs, values enable the plugin for that collection
    pages: true,
    posts: true,
  },
  // Set to true to disable the plugin without removing it from config
  disabled: false,
})
```

### VisualEditorToolbar Props

**Required:**

| Prop           | Type                                                                 | Description                                           |
| -------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `documentInfo` | `{ id: string \| number; collection: string; hasDrafts: boolean }`   | Payload CMS document metadata for the current page    |
| `editablePaths`| `string[]`                                                           | Array of PayloadCMS content paths that can be edited  |

**Optional:**

| Prop                 | Type                                           | Default     | Description                                                        |
| -------------------- | ---------------------------------------------- | ----------- | ------------------------------------------------------------------ |
| `className`          | `string`                                       | -           | Custom class applied to the toolbar container                      |
| `copyToClipboard`    | `boolean`                                      | `true`      | Copy markdown output to clipboard when copy button is clicked      |
| `endpoint`           | `string`                                       | -           | Server URL for sync (e.g. `"http://localhost:4747"`)               |
| `sessionId`          | `string`                                       | -           | Pre-existing session ID to join                                    |
| `webhookUrl`         | `string`                                       | -           | Webhook URL to receive annotation events                           |
| `enableDemoMode`     | `boolean`                                      | `false`     | Enable demo mode with sample annotations                           |
| `demoAnnotations`    | `DemoAnnotation[]`                             | -           | Array of demo annotations to display                               |
| `demoDelay`          | `number`                                       | `1000`      | Delay in ms before showing demo annotations                        |
| `onAnnotationAdd`    | `(annotation: Annotation) => void`             | -           | Callback fired when an annotation is added                         |
| `onAnnotationDelete` | `(annotation: Annotation) => void`             | -           | Callback fired when an annotation is deleted                       |
| `onAnnotationUpdate` | `(annotation: Annotation) => void`             | -           | Callback fired when an annotation comment is edited                |
| `onAnnotationsClear` | `(annotations: Annotation[]) => void`          | -           | Callback fired when all annotations are cleared                    |
| `onCopy`             | `(markdown: string) => void`                   | -           | Callback fired when copy button is clicked                         |
| `onSubmit`           | `(output: string, annotations: Annotation[])`  | -           | Callback fired when "Send to Agent" is clicked                     |
| `onSessionCreated`   | `(sessionId: string) => void`                  | -           | Called when a new session is created                               |

## How It Works

1. **Plugin injection** — The plugin adds a virtual `_sourceMap` JSON field to each configured collection
2. **Query with `contentSourceMap`** — When you query a document with `context: { contentSourceMap: true }`, Payload populates the `_sourceMap` field with content-to-path mappings
3. **`createEditableAttrs()`** — Extracts paths from `_sourceMap` and returns `data-payload-path` attributes to spread on your elements
4. **Toolbar activation** — The `VisualEditorToolbar` reads these attributes to identify editable elements, enabling click-to-edit and annotation on your live pages

```
┌─────────────────────────────────────────────────────────┐
│  Payload Query (contentSourceMap: true)                  │
│         ↓                                                │
│  _sourceMap field populated with content-to-path data    │
│         ↓                                                │
│  createEditableAttrs() → data-payload-path attributes    │
│         ↓                                                │
│  VisualEditorToolbar reads paths → enables editing       │
└─────────────────────────────────────────────────────────┘
```

## Contributing

Clone the repo and install dependencies:

```bash
git clone https://github.com/<your-org>/payloadcms-visual-editor
cd payloadcms-visual-editor
pnpm install
```

Set up the dev environment:

```bash
cp dev/.env.example dev/.env
# Update DATABASE_URL and PAYLOAD_SECRET in dev/.env
```

Start the dev server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the demo app.

### Testing & Linting

```bash
pnpm test        # Run integration + e2e tests
pnpm test:int    # Integration tests only
pnpm test:e2e    # E2E tests only
pnpm lint        # Lint source files
pnpm lint:fix    # Auto-fix lint issues
pnpm typecheck   # Run TypeScript type checking
pnpm build       # Build the package
```

## Attribution

This plugin is based on [Agentation](https://github.com/benjitaylor/agentation) by [Benji Taylor](https://github.com/benjitaylor). The original project provides an annotation toolbar for visual feedback on web pages. This plugin adapts those concepts and integrates them with Payload CMS for inline content editing and draft-aware annotation workflows.

The dev server website design is based on [Tailark's Mist component kit](https://github.com/tailark/blocks) by [Méschac Irung](https://github.com/Meschacirung).

## License

[MIT](LICENSE)
