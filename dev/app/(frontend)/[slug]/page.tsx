import type { Page as PageData } from '@/payload-types'

import configPromise from '@payload-config'
import { RenderBlocks } from 'dev/components/blocks/RenderBlocks.js'
import { RenderHero } from 'dev/heros/RenderHero'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { createEditableAttrs } from 'payload-visual-editor'

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
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: decodeURIComponent(slug),
      },
    },
  })

  const page = pageResult.docs[0] as PageData | undefined

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">Page not found</h1>
      </main>
    )
  }

  const editable = createEditableAttrs(page._sourceMap as Record<string, string> | undefined)

  return (
    <main className="bg-background min-h-screen">
      <h1 {...editable('title')} className="sr-only">
        {page.title}
      </h1>
      <RenderHero {...page.hero} _sourceMap={page._sourceMap} />
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
