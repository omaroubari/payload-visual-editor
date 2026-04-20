export function createEditableAttrs(sourceMap?: Record<string, string>) {
  return (path: string) => {
    if (!sourceMap || !Object.prototype.hasOwnProperty.call(sourceMap, path)) {
      return {}
    }

    return { 'data-payload-path': path }
  }
}
