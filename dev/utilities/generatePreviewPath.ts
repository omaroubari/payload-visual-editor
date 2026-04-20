import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import type { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
  posts: '/posts',
}

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'

type Props = {
  collection: keyof typeof collectionPrefixMap
  req: PayloadRequest
  slug: string
}

export const generatePreviewPath = ({ slug, collection }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret,
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
