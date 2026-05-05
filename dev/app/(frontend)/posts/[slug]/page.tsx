import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { createEditableAttrs } from 'payload-visual-editor'
import { VisualEditorToolbar } from 'payload-visual-editor/client'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: preview } = await draftMode()
  const { slug = 'non-draft-post' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const postResult = await payload.find({
    collection: 'posts',
    context: {
      contentSourceMap: preview,
    },
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: decodeURIComponent(slug),
      },
    },
  })

  const post = postResult.docs[0]
  const editable = createEditableAttrs(post._sourceMap as Record<string, string> | undefined)

  if (!post) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <h1 className="text-2xl font-semibold">Post not found</h1>
      </main>
    )
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <article className="mx-auto max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase text-slate-500">Non-draft post</p>
          <h1 {...editable('title')} className="text-5xl font-bold tracking-normal text-slate-950">
            {post.title}
          </h1>
          <p {...editable('excerpt')} className="mt-6 text-xl leading-8 text-slate-700">
            {post.excerpt}
          </p>
        </article>
      </main>
      {preview && post._sourceMap ? (
        <VisualEditorToolbar
          documentInfo={{
            id: post.id,
            collection: 'posts',
            hasDrafts: false,
          }}
          editablePaths={Object.keys(post._sourceMap)}
        />
      ) : null}
    </>
  )
}
