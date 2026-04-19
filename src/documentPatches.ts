export type VisualEditorPatch = {
  path: string
  value: string
}

type JsonLike = null | string | JsonLike[] | { [key: string]: JsonLike }

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function getPathSegments(path: string): string[] {
  return path.split('.').filter(Boolean)
}

function getValueAtPath(value: JsonLike, path: string): JsonLike | undefined {
  let current: JsonLike | undefined = value

  for (const segment of getPathSegments(path)) {
    if (Array.isArray(current)) {
      const index = Number(segment)

      if (!Number.isInteger(index)) {
        return undefined
      }

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
    throw new Error('Patch path is required')
  }

  let current = target

  for (let index = 0; index < segments.length - 1; index += 1) {
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
  patches: VisualEditorPatch[],
): T {
  const nextDocument = cloneValue(document)

  for (const patch of patches) {
    const currentValue = getValueAtPath(nextDocument as JsonLike, patch.path)

    if (typeof currentValue !== 'string') {
      throw new Error(`Patch path "${patch.path}" must resolve to an existing string field`)
    }

    setValueAtPath(nextDocument as JsonLike, patch.path, patch.value)
  }

  return nextDocument
}

export function buildPatchedUpdateData<T extends Record<string, unknown>>(
  document: T,
  patches: VisualEditorPatch[],
): Record<string, unknown> {
  const patchedDocument = applyPatchesToDocument(document, patches)
  const updateData: Record<string, unknown> = {}
  const rootPaths = new Set(patches.map((patch) => getPathSegments(patch.path)[0]).filter(Boolean))

  for (const rootPath of rootPaths) {
    setNestedValue(updateData, rootPath, patchedDocument[rootPath])
  }

  return updateData
}
