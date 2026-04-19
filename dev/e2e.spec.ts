import { expect, test } from '@playwright/test'

import { devUser } from './helpers/credentials'

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'

test('marks the page title only in preview mode', async ({ page }) => {
  const visualEditorReady = page.locator('[data-payload-visual-editor-ready="true"]')

  await page.goto('/home')
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)
  await expect(page.getByLabel('Visual editor popover')).toHaveCount(0)

  await page.goto('/admin')
  await page.fill('#field-email', devUser.email)
  await page.fill('#field-password', devUser.password)
  await page.click('.form-submit button')
  await expect(page).toHaveTitle(/Dashboard/)

  await page.goto(`/next/preview?path=%2Fhome&previewSecret=${previewSecret}`, {
    waitUntil: 'commit',
  })
  await expect(page).toHaveURL(/\/home$/)

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

  await page.reload()
  await expect(visualEditorReady).toHaveCount(1)
  await expect(title).toHaveText(nextTitle)

  await title.click()
  await page.getByLabel('Edit value').fill(originalTitle)
  await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled()
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Draft saved')).toBeVisible()
})
