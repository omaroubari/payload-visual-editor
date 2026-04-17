import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { RenderBlocks } from '../../../components/blocks/RenderBlocks.js'

type Args = {
  params: Promise<{
    slug?: string
  }>
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

  const page = pageResult.docs[0] as
    | {
        layout?: Array<{
          blockType?: string
          content?: null | string
          heading?: null | string
          id?: string
        }>
        title?: string
      }
    | undefined

  if (!page) {
    return (
      <main className="page-shell">
        <h1>Page not found</h1>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <h1>{page.title ?? 'Untitled Page'}</h1>
      <RenderBlocks blocks={page.layout} />
    </main>
  )
}
