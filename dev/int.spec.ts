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
      context: { disableRevalidate: true },
      headers: new Headers(),
      json: async () => ({
        id: page.id,
        action: 'save',
        collection: 'pages',
        patches: [{ path: 'title', value: nextTitle }],
      }),
      payload,
      user,
    } as never)

    expect(response.status).toBe(200)

    const draftPage = await payload.findByID({
      id: page.id,
      collection: 'pages',
      draft: true,
    })
    const publishedPage = await payload.findByID({
      id: page.id,
      collection: 'pages',
    })

    expect(draftPage.title).toBe(nextTitle)
    expect(publishedPage.title).toBe('Home')

    await payload.update({
      id: page.id,
      collection: 'pages',
      data: {
        title: 'Home',
      },
      draft: true,
    })
  })

  test('save mutation persists title changes directly for non-draft posts', async () => {
    const { docs } = await payload.find({
      collection: 'posts',
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: 'non-draft-post',
        },
      },
    })

    const post = docs[0] as unknown as { id: number | string; title: string } | undefined

    if (!post) {
      throw new Error('Expected seeded non-draft post')
    }

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
    const originalTitle = post.title
    const nextTitle = `Direct Save ${Date.now()}`

    const response = await visualEditorMutationHandler({
      context: { disableRevalidate: true },
      headers: new Headers(),
      json: async () => ({
        id: post.id,
        action: 'save',
        collection: 'posts',
        patches: [{ path: 'title', value: nextTitle }],
      }),
      payload,
      user,
    } as never)

    expect(response.status).toBe(200)

    const updatedPost = await payload.findByID({
      id: post.id,
      collection: 'posts',
    })

    expect(updatedPost.title).toBe(nextTitle)

    await payload.update({
      id: post.id,
      collection: 'posts',
      data: {
        title: originalTitle,
      },
    })
  })
})
