/* eslint-disable  perfectionist/sort-object-types */

// =============================================================================
// Shared Types
// =============================================================================

export interface Annotation {
  // Local-only sync tracking (not sent to server)
  _syncedTo?: string // Session ID this annotation was synced to
  accessibility?: string
  authorId?: string

  boundingBox?: { x: number; y: number; width: number; height: number }
  comment: string
  computedStyles?: string
  createdAt?: string
  cssClasses?: string
  drawingIndex?: number // Index of linked draw stroke (if any)
  element: string
  elementBoundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
  }> // Individual bounding boxes for multi-select hover highlighting
  elementPath: string
  fullPath?: string
  id: string
  intent?: AnnotationIntent
  isFixed?: boolean // true if element has fixed/sticky positioning (marker stays fixed)
  isMultiSelect?: boolean // true if created via drag selection
  // Annotation kind (defaults to "feedback" when undefined — backward compat)
  kind?: 'feedback' | 'placement' | 'rearrange'
  nearbyElements?: string
  nearbyText?: string
  // PayloadCMS annotation data
  payloadCMS: {
    path: string
    value: string
  }

  // Structured data for placement annotations
  placement?: {
    componentType: string
    width: number
    height: number
    scrollY: number
    text?: string
  }

  reactComponents?: string // React component hierarchy (e.g. "<App> <Dashboard> <Button>")

  // Structured data for rearrange annotations
  rearrange?: {
    selector: string
    label: string
    tagName: string
    originalRect: { x: number; y: number; width: number; height: number }
    currentRect: { x: number; y: number; width: number; height: number }
  }

  resolvedAt?: string

  resolvedBy?: 'agent' | 'human'
  selectedText?: string
  // Protocol fields (added when syncing to server)
  sessionId?: string
  severity?: AnnotationSeverity
  sourceFile?: string // Source file path from React _debugSource (dev mode only, e.g. "src/Button.tsx:42")

  status?: AnnotationStatus
  thread?: ThreadMessage[]
  timestamp: number
  updatedAt?: string
  url?: string

  x: number // % of viewport width

  y: number // px from top of document (absolute) OR viewport (if isFixed)
}

export interface PendingAnnotation extends Annotation {
  clientY?: number

  computedStylesObj?: Record<string, string>
  // Element references for cmd+shift+click multi-select (for live position queries)
  multiSelectElements?: HTMLElement[]
  // Selected animation state (create mode or edit mode)
  state?: 'edit' | 'pending'
  // Element reference for single-select (for live position queries)
  targetElement?: HTMLElement
}

// -----------------------------------------------------------------------------
// Annotation Enums
// -----------------------------------------------------------------------------

export type AnnotationIntent = 'approve' | 'change' | 'fix' | 'question'
export type AnnotationSeverity = 'blocking' | 'important' | 'suggestion'
export type AnnotationStatus = 'acknowledged' | 'dismissed' | 'pending' | 'resolved'

// -----------------------------------------------------------------------------
// PayloadCMS
// -----------------------------------------------------------------------------

export type PayloadCMSDocument = {
  collection: string
  hasDrafts: boolean
  id: number | string
}

export type PayloadCMSPatch = { path: string; value: string }

// -----------------------------------------------------------------------------
// Session
// -----------------------------------------------------------------------------

export type Session = {
  id: string
  url: string
  status: SessionStatus
  createdAt: string
  updatedAt?: string
  projectId?: string
  metadata?: Record<string, unknown>
}

export type SessionStatus = 'active' | 'approved' | 'closed'

export type SessionWithAnnotations = {
  annotations: Annotation[]
} & Session

// -----------------------------------------------------------------------------
// Thread Messages
// -----------------------------------------------------------------------------

export type ThreadMessage = {
  id: string
  role: 'agent' | 'human'
  content: string
  timestamp: number
}
