  export function createEditableAttrs(sourceMap?: Record<string, string>) {
    return (path: string) => {
      const entry = sourceMap?.[path]
      if (!entry) {
        return {}
      }
      return { 'data-payload-path': path }
    }
  }
