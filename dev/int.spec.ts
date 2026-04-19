import type { Payload } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { createEditableAttrs } from '../src/index.js'

let payload: Payload

beforeAll(async () => {
  payload = await getPayload({ config })
})

afterAll(async () => {
  await payload.destroy()
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
