import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import type { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
  posts: '/posts',
}

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
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
