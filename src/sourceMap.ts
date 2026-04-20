import type { Field } from 'payload'

type DocumentValue = Record<string, unknown>

function isRecord(value: unknown): value is DocumentValue {
  return Boolean(value) && !Array.isArray(value) && typeof value === 'object'
}

function getNamedValue(source: unknown, name: string): unknown {
  if (!isRecord(source)) {
    return undefined
  }

  return source[name]
}

function appendPath(path: string, segment: string): string {
  return path ? `${path}.${segment}` : segment
}

function addEditableFields({
  fields,
  path,
  source,
  sourceMap,
}: {
  fields: Field[]
  path: string
  source: unknown
  sourceMap: Record<string, string>
}): void {
  for (const field of fields) {
    switch (field.type) {
      case 'text':
      case 'textarea': {
        const value = getNamedValue(source, field.name)

        if (typeof value === 'string') {
          sourceMap[appendPath(path, field.name)] = value
        }

        break
      }

      case 'group': {
        const nextPath = 'name' in field ? appendPath(path, field.name) : path
        const nextSource = 'name' in field ? getNamedValue(source, field.name) : source

        addEditableFields({
          fields: field.fields,
          path: nextPath,
          source: nextSource,
          sourceMap,
        })
        break
      }

      case 'tabs': {
        for (const tab of field.tabs) {
          if ('name' in tab && tab.name) {
            addEditableFields({
              fields: tab.fields,
              path: appendPath(path, tab.name),
              source: getNamedValue(source, tab.name),
              sourceMap,
            })
          } else {
            addEditableFields({
              fields: tab.fields,
              path,
              source,
              sourceMap,
            })
          }
        }
        break
      }

      case 'collapsible':
      case 'row': {
        addEditableFields({
          fields: field.fields,
          path,
          source,
          sourceMap,
        })
        break
      }
    }
  }
}

export function buildSourceMap(fields: Field[], document: unknown): Record<string, string> {
  const sourceMap: Record<string, string> = {}

  addEditableFields({
    fields,
    path: '',
    source: document,
    sourceMap,
  })

  return sourceMap
}
