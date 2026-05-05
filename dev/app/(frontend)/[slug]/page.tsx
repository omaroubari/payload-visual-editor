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
    <>
      <main className="bg-background min-h-screen">
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1
              {...editable('title')}
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
            >
              {page.title}
            </h1>
            <p
              {...editable('title')}
              aria-label="Duplicate page title"
              className="text-sm font-semibold text-slate-600"
            >
              {page.title}
            </p>
            <p
              {...editable('title')}
              aria-label="Mixed page title"
              className="text-sm text-slate-600"
            >
              <span>{page.title}</span>
              <span> overview</span>
            </p>
          </div>
        </div>
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
          editablePaths={Object.keys(page._sourceMap)}
        />
      ) : null}
    </>
  )
}
