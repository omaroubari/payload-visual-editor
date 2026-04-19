import type { CollectionAfterReadHook, CollectionSlug, Config, FieldHook } from 'payload'

import { customEndpointHandler } from './endpoints/customEndpointHandler.js'

type Value = { [key: string]: Value } | null | string | undefined | Value[]

const populateSourceMap: FieldHook = ({ data }) => {
  if (!data) {
    return
  }

  const _sourceMap: Record<string, string> = {}

  function flatten(key: string, value: Value): void {
    if (value === null || value === undefined) {
      return
    }

    if (typeof value === 'string') {
      _sourceMap[key] = value
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        flatten(key ? `${key}.${index}` : `${index}`, item)
      })
      return
    }
    if (typeof value === 'object') {
      for (const objectKey of Object.keys(value)) {
        const nextKey = key ? `${key}.${objectKey}` : objectKey
        flatten(nextKey, value[objectKey])
      }
      return
    }
  }

  for (const key of Object.keys(data)) {
    flatten(key, data[key])
  }

  return _sourceMap
}

const sourceMapContextHandler: CollectionAfterReadHook = ({ context, doc }) => {
  if (context.contentSourceMap !== true) {
    return { ...doc, _sourceMap: undefined }
  }
}

export type PayloadVisualEditorConfig = {
  /**
   * List of collections to add a custom field
   */
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
}

const payloadVisualEditor =
  (pluginOptions: PayloadVisualEditorConfig) =>
  (config: Config): Config => {
    if (!config.collections) {
      config.collections = []
    }

    if (pluginOptions.collections) {
      for (const collectionSlug in pluginOptions.collections) {
        const collection = config.collections.find(
          (collection) => collection.slug === collectionSlug,
        )

        if (collection) {
          collection.fields.push({
            name: '_sourceMap',
            type: 'json',
            admin: {
              disabled: true,
              hidden: true,
              position: 'sidebar',
            },
            hooks: {
              afterRead: [populateSourceMap],
            },
            virtual: true,
          })

          collection.hooks ??= {}
          collection.hooks.afterRead ??= []
          collection.hooks.afterRead.push(sourceMapContextHandler)
        }
      }
    }

    /**
     * If the plugin is disabled, we still want to keep added collections/fields so the database schema is consistent which is important for migrations.
     * If your plugin heavily modifies the database schema, you may want to remove this property.
     */
    if (pluginOptions.disabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    if (!config.admin.components.beforeDashboard) {
      config.admin.components.beforeDashboard = []
    }

    // config.admin.components.beforeDashboard.push(
    //   `payload-visual-editor/client#BeforeDashboardClient`,
    // )
    // config.admin.components.beforeDashboard.push(`payload-visual-editor/rsc#BeforeDashboardServer`)

    config.endpoints.push({
      handler: customEndpointHandler,
      method: 'get',
      path: '/my-plugin-endpoint',
    })

    return config
  }

export { payloadVisualEditor }
export { createEditableAttrs } from './utilities.js'
