import type { CollectionSlug, PayloadHandler } from 'payload'
import type { PayloadCMSPatch } from '../types.js'

import { buildPatchedUpdateData } from '../utils/payloodcms-patches.js'

type VisualEditorMutationRequest = {
  action: 'publish' | 'save'
  collection: CollectionSlug
  id: number | string
  patches: PayloadCMSPatch[]
}

function isVisualEditorMutationRequest(value: unknown): value is VisualEditorMutationRequest {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<VisualEditorMutationRequest>

  return (
    (candidate.action === 'save' || candidate.action === 'publish') &&
    typeof candidate.collection === 'string' &&
    (typeof candidate.id === 'string' || typeof candidate.id === 'number') &&
    Array.isArray(candidate.patches)
  )
}

function collectionHasDrafts(req: Parameters<PayloadHandler>[0], collectionSlug: CollectionSlug) {
  const collection = req.payload.config.collections.find((entry) => entry.slug === collectionSlug)

  return Boolean(collection?.versions?.drafts)
}

export const visualEditorMutationHandler: PayloadHandler = async (req) => {
  const user = req.user ?? (await req.payload.auth({ headers: req.headers, req })).user
  console.log('visual editor handler')
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const operationReq = {
    ...req,
    user,
  }

  if (!req.json) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const body = await req.json()

  if (!isVisualEditorMutationRequest(body)) {
    return Response.json({ error: 'Invalid visual editor mutation payload' }, { status: 400 })
  }

  if (!body.patches.length) {
    return Response.json({ error: 'At least one patch is required' }, { status: 400 })
  }

  try {
    const hasDrafts = collectionHasDrafts(req, body.collection)

    if (body.action === 'publish' && !hasDrafts) {
      return Response.json(
        { error: 'Publish is only available for draft-enabled collections' },
        { status: 400 },
      )
    }

    const currentDocument = (await req.payload.findByID({
      id: body.id,
      collection: body.collection,
      depth: 0,
      draft: hasDrafts,
      req: operationReq,
    })) as unknown as Record<string, unknown>

    const data = buildPatchedUpdateData(currentDocument, body.patches)

    console.log({ data })
    const updateData =
      body.action === 'publish'
        ? {
            ...data,
            _status: 'published',
          }
        : data

    const updatedDocument = await req.payload.update({
      id: body.id,
      collection: body.collection,
      data: updateData,
      depth: 0,
      draft: hasDrafts,
      req: operationReq,
    })

    return Response.json({ doc: updatedDocument })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to apply visual editor mutation'

    return Response.json({ error: message }, { status: 400 })
  }
}
