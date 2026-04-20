'use client'

import { useEffect, useMemo, useState } from 'react'

import type { VisualEditorPatch } from '../documentPatches.js'
import type { VisualEditorDocument } from '../runtime.js'

import {
  getLocalReplacement,
  getPendingValue,
  isAllowedEditablePath,
} from '../localPreviewState.js'

type SimpleElement = {
  dataset: {
    payloadPath?: string
  } & DOMStringMap
} & HTMLElement

type Props = {
  document: VisualEditorDocument
  editablePaths?: string[]
}

type ActiveField = {
  path: string
  rect: DOMRect
}

function isSimpleTextElement(element: Element): element is SimpleElement {
  if (!(element instanceof HTMLElement)) {
    return false
  }

  return (
    element.childNodes.length === 1 &&
    element.firstChild?.nodeType === Node.TEXT_NODE &&
    !element.querySelector('*')
  )
}

function readElementValue(element: SimpleElement) {
  return element.textContent ?? ''
}

function updateElements(path: string, value: string, editablePaths?: string[]) {
  const selector = `[data-payload-path="${CSS.escape(path)}"]`

  for (const element of document.querySelectorAll(selector)) {
    const replacement = getLocalReplacement(
      {
        path: element instanceof HTMLElement ? element.dataset.payloadPath : undefined,
        replaceable: isSimpleTextElement(element),
      },
      { path, value },
      editablePaths,
    )

    if (replacement === undefined) {
      continue
    }

    element.textContent = replacement
  }
}

export function VisualEditor({ document: visualDocument, editablePaths }: Props) {
  const [activeField, setActiveField] = useState<ActiveField | null>(null)
  const [patches, setPatches] = useState<Record<string, string>>({})
  const [draftValue, setDraftValue] = useState('')
  const [pendingAction, setPendingAction] = useState<'publish' | 'save' | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [saveError, setSaveError] = useState<null | string>(null)
  const [status, setStatus] = useState<null | string>(null)

  const patchList = useMemo<VisualEditorPatch[]>(
    () =>
      Object.entries(patches).map(([path, value]) => ({
        path,
        value,
      })),
    [patches],
  )

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const marker = target.closest('[data-payload-path]')

      if (!marker || !(marker instanceof HTMLElement)) {
        return
      }

      const path = marker.dataset.payloadPath

      if (!path) {
        return
      }

      if (!isAllowedEditablePath(path, editablePaths)) {
        return
      }

      event.preventDefault()

      const resolvedPath = path

      setActiveField({
        path: resolvedPath,
        rect: marker.getBoundingClientRect(),
      })
      setDraftValue(
        getPendingValue(
          resolvedPath,
          patches,
          isSimpleTextElement(marker) ? readElementValue(marker) : (marker.textContent ?? ''),
        ),
      )
      setSaveError(null)
      setStatus(null)
    }

    document.addEventListener('click', handleClick)
    setIsReady(true)

    return () => {
      document.removeEventListener('click', handleClick)
      setIsReady(false)
    }
  }, [editablePaths, patches])

  async function mutatePatches(action: 'publish' | 'save') {
    if (!patchList.length) {
      return
    }

    setPendingAction(action)
    setSaveError(null)
    setStatus(null)

    try {
      const response = await fetch(`${visualDocument.apiPath ?? '/api'}/payload-visual-editor`, {
        body: JSON.stringify({
          id: visualDocument.id,
          action,
          collection: visualDocument.collection,
          patches: patchList,
        }),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(payload?.error ?? 'Save failed')
      }

      setPatches({})
      setStatus(
        action === 'publish' ? 'Published' : visualDocument.hasDrafts ? 'Draft saved' : 'Saved',
      )
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : `${action === 'publish' ? 'Publish' : 'Save'} failed`,
      )
    } finally {
      setPendingAction(null)
    }
  }

  if (!activeField) {
    return isReady ? (
      <span aria-hidden="true" data-payload-visual-editor-ready="true" hidden />
    ) : null
  }

  const top = Math.min(activeField.rect.bottom + 12, window.innerHeight - 180)
  const left = Math.min(activeField.rect.left, window.innerWidth - 320)

  return (
    <>
      {isReady ? <span aria-hidden="true" data-payload-visual-editor-ready="true" hidden /> : null}
      <div
        aria-label="Visual editor popover"
        className="fixed z-[1000] w-80 rounded-xl border border-black/10 bg-white p-4 shadow-2xl"
        style={{
          left,
          top,
        }}
      >
        <div className="mb-2 text-sm font-semibold text-slate-900">{activeField.path}</div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Title
        </label>
        <input
          aria-label="Edit value"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none"
          onChange={(event) => {
            const nextValue = event.target.value

            setDraftValue(nextValue)
            setPatches((current) => ({
              ...current,
              [activeField.path]: nextValue,
            }))
            updateElements(activeField.path, nextValue, editablePaths)
            setStatus(null)
          }}
          value={draftValue}
        />
        {saveError ? <p className="mt-2 text-sm text-red-600">{saveError}</p> : null}
        {status ? <p className="mt-2 text-sm text-emerald-700">{status}</p> : null}
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            onClick={() => {
              setActiveField(null)
              setSaveError(null)
            }}
            type="button"
          >
            Close
          </button>
          {visualDocument.hasDrafts ? (
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pendingAction !== null || patchList.length === 0}
              onClick={() => void mutatePatches('publish')}
              type="button"
            >
              {pendingAction === 'publish' ? 'Publishing…' : 'Publish'}
            </button>
          ) : null}
          <button
            className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pendingAction !== null || patchList.length === 0}
            onClick={() => void mutatePatches('save')}
            type="button"
          >
            {pendingAction === 'save' ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}
