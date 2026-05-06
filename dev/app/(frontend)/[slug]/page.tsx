import type { Page as PageData } from '@/payload-types'

import configPromise from '@payload-config'
import { RenderBlocks } from 'dev/components/blocks/RenderBlocks.js'
import { RenderHero } from 'dev/heros/RenderHero'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { createEditableAttrs } from 'payload-visual-editor'
import { VisualEditorToolbar } from 'payload-visual-editor/client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const pageResult = await payload.find({
    collection: 'pages',
    context: {
      contentSourceMap: draft,
    },
    draft,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: decodeURIComponent(slug),
      },
    },
  })

  const page = pageResult.docs[0]

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">Page not found</h1>
      </main>
    )
  }

  return (
    <>
      <main className="bg-background min-h-screen">
        <RenderHero {...page.hero} _sourceMap={page._sourceMap} />
        <RenderBlocks blocks={page.layout} />
      </main>
      {draft && page._sourceMap ? (
        <VisualEditorToolbar
          documentInfo={{
            id: page.id,
            collection: 'pages',
            hasDrafts: true,
          }}
        />
      ) : null}
    </>
  )
}
