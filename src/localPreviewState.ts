export type LocalPreviewPatch = {
  path: string
  value: string
}

export type LocalPreviewTarget = {
  path?: string
  replaceable: boolean
}

export function isAllowedEditablePath(path: string | undefined, editablePaths?: string[]) {
  if (!path) {
    return false
  }

  if (!editablePaths?.length) {
    return true
  }

  return editablePaths.includes(path)
}

export function getPendingValue(
  path: string,
  patches: Record<string, string>,
  fallbackValue: string,
) {
  return patches[path] ?? fallbackValue
}

export function getLocalReplacement(
  target: LocalPreviewTarget,
  patch: LocalPreviewPatch,
  editablePaths?: string[],
) {
  if (target.path !== patch.path) {
    return undefined
  }

  if (!target.replaceable) {
    return undefined
  }

  if (!isAllowedEditablePath(target.path, editablePaths)) {
    return undefined
  }

  return patch.value
}

