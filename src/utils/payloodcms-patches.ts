import type { Annotation, PayloadCMSPatch } from 'src/types.js'

type JsonLike = { [key: string]: JsonLike } | JsonLike[] | null | string

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function getPathSegments(path: string): string[] {
  return path.split('.').filter(Boolean)
}

function validatePatch(patch: Record<string, unknown>): PayloadCMSPatch {
  const { path, value } = patch

  if (typeof path !== 'string' || !path.trim()) {
    throw new Error('PayloadCMSPatch path is required')
  }

  if (typeof value !== 'string') {
    throw new Error(`PayloadCMSPatch value for "${path}" must be a string`)
  }

  return { path, value }
}

function getValueAtPath(value: JsonLike, path: string): JsonLike | undefined {
  let current: JsonLike | undefined = value

  for (const segment of getPathSegments(path)) {
    // if `current` is an array, reassign its value to the current segment
    if (Array.isArray(current)) {
      const index = Number(segment)

      current = current[index]
      continue
    }

    if (!current || typeof current !== 'object') {
      return undefined
    }

    current = current[segment]
  }

  return current
}

function setValueAtPath(target: JsonLike, path: string, nextValue: string): void {
  const segments = getPathSegments(path)

  if (!segments.length) {
    throw new Error('PayloadCMSPatch path is required')
  }

  let current = target
  // stop traversing one segment early so we reach the PARENT object of the final property
  for (let index = 0; index < segments.length - 1; index++) {
    const segment = segments[index]
    if (Array.isArray(current)) {
      current = current[Number(segment)]
      continue
    }

    if (!current || typeof current !== 'object') {
      throw new Error(`Cannot set patch at "${path}"`)
    }

    current = current[segment]
  }

  const lastSegment = segments[segments.length - 1]

  if (Array.isArray(current)) {
    current[Number(lastSegment)] = nextValue
    return
  }

  if (!current || typeof current !== 'object') {
    throw new Error(`Cannot set patch at "${path}"`)
  }

  current[lastSegment] = nextValue
}

function setNestedValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const segments = getPathSegments(path)
  let current: Record<string, unknown> = target

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]
    const existing = current[segment]

    if (!existing || Array.isArray(existing) || typeof existing !== 'object') {
      current[segment] = {}
    }

    current = current[segment] as Record<string, unknown>
  }

  current[segments[segments.length - 1]] = value
}

export function applyPatchesToDocument<T extends Record<string, unknown>>(
  document: T,
  patches: PayloadCMSPatch[],
): T {
  const nextDocument = cloneValue(document)
  const validPatches = patches.map((patch) => validatePatch(patch))

  for (const patch of validPatches) {
    const currentValue = getValueAtPath(nextDocument as JsonLike, patch.path)

    if (typeof currentValue !== 'string') {
      throw new Error(
        `PayloadCMSPatch path "${patch.path}" must resolve to an existing string field`,
      )
    }

    // mutates nextDocument with patch
    setValueAtPath(nextDocument as JsonLike, patch.path, patch.value)
  }

  return nextDocument
}

export function buildPatchedUpdateData<T extends Record<string, unknown>>(
  document: T,
  patches: PayloadCMSPatch[],
): Record<string, unknown> {
  const validPatches = patches.map((patch) => validatePatch(patch))
  const patchedDocument = applyPatchesToDocument(document, validPatches)
  const updateData: Record<string, unknown> = {}
  // extract root-level fields that were modified
  const rootPaths = new Set(
    validPatches.map((patch) => getPathSegments(patch.path)[0]).filter(Boolean),
  )
  // create minimal update payload
  for (const rootPath of rootPaths) {
    setNestedValue(updateData, rootPath, patchedDocument[rootPath])
  }

  return updateData
}

export function generatePatches(annotations: Annotation[]) {
  const patches: PayloadCMSPatch[] = []
  annotations.forEach((a) => patches.push({ path: a.payloadCMS.path, value: a.payloadCMS.value }))
  return patches
}
