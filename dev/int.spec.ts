import type { Payload } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { visualEditorMutationHandler } from '../src/endpoints/visualEditorMutationHandler.js'
import { createEditableAttrs } from '../src/index.js'
import { getLocalReplacement, getPendingValue } from '../src/localPreviewState.js'
import { applyPatchesToDocument } from '../src/utils/payloodcms-patches.js'
import { buildSourceMap } from '../src/utils/source-map.js'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })

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

  if (page) {
    const resetHero = {
      ...page.hero,
      heading: 'Build 10x Faster with Mist',
      subheading: 'Craft. Build. Ship modern websites with AI support.',
    }

    await payload.update({
      id: page.id,
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        hero: resetHero,
        title: 'Home',
      },
    })

    await payload.update({
      id: page.id,
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        hero: resetHero,
        title: 'Home',
      },
      draft: true,
    })
  }
})

afterAll(async () => {
  await payload?.destroy()
})

describe('Preview source map integration', () => {
  test('source maps exclude unsupported field types and block-like content', () => {
    const sourceMap = buildSourceMap(
      [
        { name: 'title', type: 'text' },
        { name: 'summary', type: 'textarea' },
        { name: 'status', type: 'select', options: ['draft', 'published'] },
        { name: 'content', type: 'richText' },
        { name: 'metadata', type: 'json' },
        { name: 'author', type: 'relationship', relationTo: 'users' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'label', type: 'text' }],
        },
        {
          name: 'layout',
          type: 'blocks',
          blocks: [
            {
              slug: 'cta',
              fields: [{ name: 'heading', type: 'text' }],
            },
          ],
        },
        {
          name: 'hero',
          type: 'group',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'asset', type: 'upload', relationTo: 'media' },
          ],
        },
      ] as never,
      {
        author: 'user-id',
        content: { root: { children: [] } },
        hero: {
          asset: 'media-id',
          heading: 'Nested Hero',
        },
        items: [{ label: 'Array Label' }],
        layout: [{ blockType: 'cta', heading: 'Block Heading' }],
        metadata: { title: 'Metadata Title' },
        status: 'draft',
        summary: 'Editable Summary',
        title: 'Editable Title',
      },
    )

    expect(sourceMap).toEqual({
      'hero.heading': 'Nested Hero',
      summary: 'Editable Summary',
      title: 'Editable Title',
    })
  })

  test('preview reads include schema-aware source map entries for root and nested text fields', async () => {
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
      'hero.heading': 'Build 10x Faster with Mist',
      'hero.subheading': 'Craft. Build. Ship modern websites with AI support.',
      title: 'Home',
    })
    expect(page?._sourceMap).not.toHaveProperty('hero.type')
    expect(page?._sourceMap).not.toHaveProperty('layout.0.heading')
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
    const editableWithEmptyValue = createEditableAttrs({ title: '' })

    expect(page?._sourceMap).toBeUndefined()
    expect(editable('title')).toEqual({})
    expect(editable('does-not-exist')).toEqual({})
    expect(editableWithEmptyValue('title')).toEqual({ 'data-payload-path': 'title' })
  })
})

describe('Visual editor save mutation', () => {
  test('local preview state synchronizes duplicate replaceable targets and skips mixed-content replacements', () => {
    const patches = {
      title: 'Pending Home',
    }

    expect(getPendingValue('title', patches, 'Home')).toBe('Pending Home')
    expect(
      getLocalReplacement(
        {
          path: 'title',
          replaceable: true,
        },
        { path: 'title', value: 'Pending Home' },
        ['title'],
      ),
    ).toBe('Pending Home')
    expect(
      getLocalReplacement(
        {
          path: 'title',
          replaceable: false,
        },
        { path: 'title', value: 'Pending Home' },
        ['title'],
      ),
    ).toBeUndefined()
  })

  test('applyPatchesToDocument updates an existing string path and rejects invalid patches', () => {
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

    expect(() =>
      applyPatchesToDocument(
        {
          title: 'Home',
        },
        [{ path: '', value: 'Updated Home' }],
      ),
    ).toThrow('Patch path is required')

    expect(() =>
      applyPatchesToDocument(
        {
          title: 'Home',
        },
        [{ path: 'title', value: 123 } as never],
      ),
    ).toThrow('Patch value for "title" must be a string')

    expect(() =>
      applyPatchesToDocument(
        {
          title: 'Home',
          views: 10,
        },
        [{ path: 'views', value: 'Ten' }],
      ),
    ).toThrow('must resolve to an existing string field')
  })

  test('applyPatchesToDocument updates existing nested string paths', () => {
    expect(
      applyPatchesToDocument(
        {
          hero: {
            heading: 'Build 10x Faster with Mist',
            subheading: 'Craft. Build. Ship modern websites with AI support.',
          },
          title: 'Home',
        },
        [
          { path: 'hero.heading', value: 'Nested Heading' },
          { path: 'hero.subheading', value: 'Nested Subheading' },
        ],
      ),
    ).toMatchObject({
      hero: {
        heading: 'Nested Heading',
        subheading: 'Nested Subheading',
      },
      title: 'Home',
    })
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
      context: { disableRevalidate: true },
      data: {
        title: 'Home',
      },
      draft: true,
    })
  })

  test('save mutation rejects malformed and out-of-scope patches before updating', async () => {
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

    for (const patches of [
      [{ path: '', value: 'Missing path' }],
      [{ path: 'title', value: 123 }],
      [{ op: 'replace', path: 'title', value: 'Unsupported operation' }],
      [{ path: 'hero.links', value: 'Unsupported non-string target' }],
    ] as unknown[]) {
      const response = await visualEditorMutationHandler({
        context: { disableRevalidate: true },
        headers: new Headers(),
        json: async () => ({
          id: page.id,
          action: 'save',
          collection: 'pages',
          patches,
        }),
        payload,
        user,
      } as never)

      expect(response.status).toBe(400)
    }

    const draftPage = await payload.findByID({
      id: page.id,
      collection: 'pages',
      draft: true,
    })

    expect(draftPage.title).toBe('Home')
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

  test('publish mutation applies pending title changes and publishes pages', async () => {
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
    const nextTitle = `Published Home ${Date.now()}`

    const response = await visualEditorMutationHandler({
      context: { disableRevalidate: true },
      headers: new Headers(),
      json: async () => ({
        id: page.id,
        action: 'publish',
        collection: 'pages',
        patches: [{ path: 'title', value: nextTitle }],
      }),
      payload,
      user,
    } as never)

    expect(response.status).toBe(200)

    const publishedPage = await payload.findByID({
      id: page.id,
      collection: 'pages',
    })

    expect(publishedPage.title).toBe(nextTitle)
    expect(publishedPage._status).toBe('published')

    await payload.update({
      id: page.id,
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        title: 'Home',
      },
    })
  })
})
