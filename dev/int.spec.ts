import type { Payload } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { applyPatchesToDocument } from '../src/documentPatches.js'
import { visualEditorMutationHandler } from '../src/endpoints/visualEditorMutationHandler.js'
import { createEditableAttrs } from '../src/index.js'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
})

afterAll(async () => {
  await payload?.destroy()
})

describe('Preview source map integration', () => {
  test('preview reads include a source map entry for title', async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      context: {
        contentSourceMap: true,
      },
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    const page = docs[0]

    expect(page).toBeDefined()
    expect(page?._sourceMap).toMatchObject({
      title: 'Home',
    })
  })

  test('non-preview reads omit the source map and unknown paths return no attrs', async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    const page = docs[0]
    const editable = createEditableAttrs(page?._sourceMap as Record<string, string> | undefined)

    expect(page?._sourceMap).toBeUndefined()
    expect(editable('title')).toEqual({})
    expect(editable('does-not-exist')).toEqual({})
  })
})

describe('Visual editor save mutation', () => {
  test('applyPatchesToDocument updates an existing string path and rejects missing paths', () => {
    expect(
      applyPatchesToDocument(
        {
          title: 'Home',
        },
        [{ path: 'title', value: 'Updated Home' }],
      ),
    ).toMatchObject({
      title: 'Updated Home',
    })

    expect(() =>
      applyPatchesToDocument(
        {
          title: 'Home',
        },
        [{ path: 'hero.heading', value: 'Updated Home' }],
      ),
    ).toThrow('must resolve to an existing string field')
  })

  test('save mutation persists title changes as a draft update for pages', async () => {
    const { docs } = await payload.find({
      collection: 'pages',
      draft: true,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    const page = docs[0]

    expect(page).toBeDefined()

    const userResult = await payload.find({
      collection: 'users',
      limit: 1,
      pagination: false,
      where: {
        email: {
          equals: 'dev@payloadcms.com',
        },
      },
    })

    const user = userResult.docs[0]
    const nextTitle = `Home Draft ${Date.now()}`

    const response = await visualEditorMutationHandler({
      headers: new Headers(),
      json: async () => ({
        action: 'save',
        collection: 'pages',
        id: page.id,
        patches: [{ path: 'title', value: nextTitle }],
      }),
      payload,
      user,
    } as never)

    expect(response.status).toBe(200)

    const draftPage = await payload.findByID({
      collection: 'pages',
      draft: true,
      id: page.id,
    })
    const publishedPage = await payload.findByID({
      collection: 'pages',
      id: page.id,
    })

    expect(draftPage.title).toBe(nextTitle)
    expect(publishedPage.title).toBe('Home')

    await payload.update({
      collection: 'pages',
      data: {
        title: 'Home',
      },
      draft: true,
      id: page.id,
    })
  })
})
