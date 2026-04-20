import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'

import { devUser } from './helpers/credentials'

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'
const previewURL = `/next/preview?path=%2Fhome&previewSecret=${previewSecret}`
const nonDraftPreviewURL = `/next/preview?path=%2Fposts%2Fnon-draft-post&previewSecret=${previewSecret}`

async function enterPreview(page: Page, url: string, path: RegExp) {
  const visualEditorReady = page.locator('[data-payload-visual-editor-ready="true"]')

  for (let attempt = 0; attempt < 2; attempt += 1) {
    await page.goto(url, {
      waitUntil: 'commit',
    })
    await expect(page).toHaveURL(path, { timeout: 30_000 })

    if ((await visualEditorReady.count()) > 0) {
      return
    }
  }

  await expect(visualEditorReady).toHaveCount(1, { timeout: 30_000 })
}

test('edits draft and non-draft preview documents', async ({ page }) => {
  test.setTimeout(180_000)

  const visualEditorReady = page.locator('[data-payload-visual-editor-ready="true"]')

  await page.goto('/home')
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)
  await expect(page.getByLabel('Visual editor popover')).toHaveCount(0)

  await page.goto('/admin')

  const emailField = page.locator('#field-email')

  await expect(emailField).toBeVisible({ timeout: 120_000 })
  await page.fill('#field-email', devUser.email)
  await page.fill('#field-password', devUser.password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveTitle(/Dashboard/, { timeout: 60_000 })

  await enterPreview(page, previewURL, /\/home$/)

  const title = page.locator('[data-payload-path="title"]')

  await expect(visualEditorReady).toHaveCount(1)
  await expect(title).toHaveCount(1)

  const originalTitle = (await title.textContent()) ?? ''
  const nextTitle = `Home Draft ${Date.now()}`

  await expect(title).toHaveText(originalTitle)

  await title.click()
  await expect(page.getByLabel('Visual editor popover')).toBeVisible()
  await page.getByLabel('Edit value').fill(nextTitle)
  await expect(title).toHaveText(nextTitle)

  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await enterPreview(page, previewURL, /\/home$/)
  await expect(visualEditorReady).toHaveCount(1)
  await expect(title).toHaveText(nextTitle)

  const subheading = page.locator('[data-payload-path="hero.subheading"]')
  await expect(subheading).toHaveCount(1)

  const originalSubheading = (await subheading.textContent()) ?? ''
  const nextSubheading = `Nested textarea draft ${Date.now()}`

  await subheading.click()
  await expect(page.getByLabel('Visual editor popover')).toBeVisible()
  await page.getByLabel('Edit value').fill(nextSubheading)
  await expect(subheading).toHaveText(nextSubheading)

  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await page.goto(previewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 })
  await expect(visualEditorReady).toHaveCount(1)
  await expect(subheading).toHaveText(nextSubheading)

  await subheading.click()
  await page.getByLabel('Edit value').fill(originalSubheading)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await title.click()
  await page.getByLabel('Edit value').fill(originalTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()

  await enterPreview(page, previewURL, /\/home$/)
  await expect(visualEditorReady).toHaveCount(1)

  const publishedTitle = `Published Home ${Date.now()}`

  await title.click()
  await page.getByLabel('Edit value').fill(publishedTitle)
  await expect(page.getByRole('button', { name: 'Publish' })).toBeEnabled()
  await page.getByRole('button', { name: 'Publish' }).click()
  await expect(page.getByText('Published')).toBeVisible()

  await page.goto('/next/exit-preview')
  await page.goto('/home')
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)
  await expect(page.locator('h1').first()).toHaveText(publishedTitle)

  await enterPreview(page, previewURL, /\/home$/)
  await expect(visualEditorReady).toHaveCount(1)

  await title.click()
  await page.getByLabel('Edit value').fill(originalTitle)
  await expect(page.getByRole('button', { name: 'Publish' })).toBeEnabled()
  await page.getByRole('button', { name: 'Publish' }).click()
  await expect(page.getByText('Published')).toBeVisible()

  await enterPreview(page, nonDraftPreviewURL, /\/posts\/non-draft-post$/)

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

  await enterPreview(page, nonDraftPreviewURL, /\/posts\/non-draft-post$/)
  await expect(visualEditorReady).toHaveCount(1)
  await expect(nonDraftTitle).toHaveText(nextPostTitle)

  await nonDraftTitle.click()
  await page.getByLabel('Edit value').fill(originalPostTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Saved', { exact: true })).toBeVisible()
})
