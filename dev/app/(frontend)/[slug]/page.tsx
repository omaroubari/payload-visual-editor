import type { PageBlock } from 'dev/components/blocks/RenderBlocks.js'
import type { HeroData } from 'dev/heros/types'

import configPromise from '@payload-config'
import { RenderBlocks } from 'dev/components/blocks/RenderBlocks.js'
import { RenderHero } from 'dev/heros/RenderHero'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

type PageData = {
  hero?: HeroData | null
  layout?: null | PageBlock[]
  title?: null | string
}

export default async function Page({ params: paramsPromise }: Args) {
  const { slug = 'home' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const pageResult = await payload.find({
    collection: 'pages',
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

  return (
    <main className="bg-background min-h-screen">
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
