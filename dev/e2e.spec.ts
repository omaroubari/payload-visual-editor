import { expect, test } from '@playwright/test'

import { devUser } from './helpers/credentials'

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'
const previewURL = `/next/preview?path=%2Fhome&previewSecret=${previewSecret}`

test('marks the page title only in preview mode', async ({ page }) => {
  test.setTimeout(90_000)

  const visualEditorReady = page.locator('[data-payload-visual-editor-ready="true"]')

  await page.goto('/home')
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)
  await expect(page.getByLabel('Visual editor popover')).toHaveCount(0)

  await page.goto('/admin')
  await page.fill('#field-email', devUser.email)
  await page.fill('#field-password', devUser.password)
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page).toHaveTitle(/Dashboard/, { timeout: 30_000 })

  await page.goto(previewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 })

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

  await page.goto(previewURL, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/, { timeout: 30_000 })
  await expect(visualEditorReady).toHaveCount(1)
  await expect(title).toHaveText(nextTitle)

  await title.click()
  await page.getByLabel('Edit value').fill(originalTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()
})
