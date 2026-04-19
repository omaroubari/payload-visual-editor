import type { CollectionSlug, PayloadHandler } from 'payload'

import { buildPatchedUpdateData, type VisualEditorPatch } from '../documentPatches.js'

type SaveMutationRequest = {
  action: 'save'
  collection: CollectionSlug
  id: number | string
  patches: VisualEditorPatch[]
}

function isSaveMutationRequest(value: unknown): value is SaveMutationRequest {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SaveMutationRequest>

  return (
    candidate.action === 'save' &&
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
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!req.json) {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const body = await req.json()

  if (!isSaveMutationRequest(body)) {
    return Response.json({ error: 'Invalid visual editor mutation payload' }, { status: 400 })
  }

  if (!body.patches.length) {
    return Response.json({ error: 'At least one patch is required' }, { status: 400 })
  }

  try {
    const currentDocument = (await req.payload.findByID({
      collection: body.collection,
      depth: 0,
      draft: collectionHasDrafts(req, body.collection),
      id: body.id,
      req,
    })) as unknown as Record<string, unknown>

    const data = buildPatchedUpdateData(currentDocument, body.patches)

    const updatedDocument = await req.payload.update({
      collection: body.collection,
      data,
      depth: 0,
      draft: collectionHasDrafts(req, body.collection),
      id: body.id,
      req,
    })

    return Response.json({ doc: updatedDocument })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to apply visual editor mutation'

    return Response.json({ error: message }, { status: 400 })
  }
}
