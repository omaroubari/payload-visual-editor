import type { CollectionAfterReadHook, CollectionSlug, Config, Field, FieldHook } from 'payload'

import { visualEditorMutationHandler } from './endpoints/visualEditorMutationHandler.js'
import { buildSourceMap } from './sourceMap.js'

const createPopulateSourceMap =
  (fields: Field[]): FieldHook =>
  ({ data }) => {
    if (!data) {
      return
    }

    return buildSourceMap(fields, data)
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
          const sourceMapFields = [...collection.fields]

          collection.fields.push({
            name: '_sourceMap',
            type: 'json',
            admin: {
              disabled: true,
              hidden: true,
              position: 'sidebar',
            },
            hooks: {
              afterRead: [createPopulateSourceMap(sourceMapFields)],
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
      handler: visualEditorMutationHandler,
      method: 'post',
      path: '/payload-visual-editor',
    })

    return config
  }

export { payloadVisualEditor }
export {
  applyPatchesToDocument,
  buildPatchedUpdateData,
  type VisualEditorPatch,
} from './documentPatches.js'
export type { VisualEditorDocument } from './runtime.js'
export { buildSourceMap } from './sourceMap.js'
export { createEditableAttrs } from './utilities.js'
