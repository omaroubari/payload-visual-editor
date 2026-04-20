import { expect, test } from '@playwright/test'

import { devUser } from './helpers/credentials'

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'
const previewURL = `/next/preview?path=%2Fhome&previewSecret=${previewSecret}`
const nonDraftPreviewURL = `/next/preview?path=%2Fposts%2Fnon-draft-post&previewSecret=${previewSecret}`

test('edits draft and non-draft preview documents', async ({ page }) => {
  test.setTimeout(120_000)
  page.setDefaultNavigationTimeout(60_000)
  page.setDefaultTimeout(60_000)

  const visualEditorReady = page.locator('[data-payload-visual-editor-ready="true"]')

  await page.goto('/home', { timeout: 60_000 })
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)
  await expect(page.getByLabel('Visual editor popover')).toHaveCount(0)

  const loginResponse = await page.request.post('/api/users/login', {
    data: devUser,
  })

  expect(loginResponse.ok()).toBeTruthy()

  await page.goto(previewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 })

  const titleTargets = page.locator('[data-payload-path="title"]')
  const title = titleTargets.first()
  const duplicateTitle = page.getByLabel('Duplicate page title')
  const mixedTitle = page.getByLabel('Mixed page title')

  await expect(visualEditorReady).toHaveCount(1)
  await expect(titleTargets).toHaveCount(3)

  const originalTitle = (await title.textContent()) ?? ''
  const nextTitle = `Home Draft ${Date.now()}`

  await expect(title).toHaveText(originalTitle)
  await expect(duplicateTitle).toHaveText(originalTitle)
  await expect(mixedTitle).toHaveText(`${originalTitle} overview`)

  await title.click()
  await expect(page.getByLabel('Visual editor popover')).toBeVisible()
  await page.getByLabel('Edit value').fill(nextTitle)
  await expect(title).toHaveText(nextTitle)
  await expect(duplicateTitle).toHaveText(nextTitle)
  await expect(mixedTitle).toHaveText(`${originalTitle} overview`)

  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await page.goto(previewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 })
  await expect(visualEditorReady).toHaveCount(1)
  await expect(title).toHaveText(nextTitle)
  await expect(duplicateTitle).toHaveText(nextTitle)
  await expect(mixedTitle).toHaveText(`${nextTitle} overview`)

  await title.click()
  await page.getByLabel('Edit value').fill(originalTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await page.goto(nonDraftPreviewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/posts\/non-draft-post$/, { timeout: 30_000 })

  const nonDraftTitle = page.locator('[data-payload-path="title"]')

  await expect(visualEditorReady).toHaveCount(1)
  await expect(nonDraftTitle).toHaveCount(1)

  const originalPostTitle = (await nonDraftTitle.textContent()) ?? ''
  const nextPostTitle = `Direct Save ${Date.now()}`

  await nonDraftTitle.click()
  await expect(page.getByLabel('Visual editor popover')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Publish' })).toHaveCount(0)
  await page.getByLabel('Edit value').fill(nextPostTitle)
  await expect(nonDraftTitle).toHaveText(nextPostTitle)

  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()

  await page.goto(nonDraftPreviewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/posts\/non-draft-post$/, { timeout: 30_000 })
  await expect(visualEditorReady).toHaveCount(1)
  await expect(nonDraftTitle).toHaveText(nextPostTitle)

  await nonDraftTitle.click()
  await page.getByLabel('Edit value').fill(originalPostTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
})
