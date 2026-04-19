import { expect, test } from '@playwright/test'

import { devUser } from './helpers/credentials'

const previewSecret = process.env.PREVIEW_SECRET || '83494cd0a71ef3f0'

test('marks the page title only in preview mode', async ({ page }) => {
  await page.goto('/home')
  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(0)

  await page.goto('/admin')
  await page.fill('#field-email', devUser.email)
  await page.fill('#field-password', devUser.password)
  await page.click('.form-submit button')
  await expect(page).toHaveTitle(/Dashboard/)

  await page.goto(`/next/preview?path=%2Fhome&previewSecret=${previewSecret}`)
  await expect(page).toHaveURL(/\/home$/)

  await expect(page.locator('[data-payload-path="title"]')).toHaveCount(1)
  await expect(page.locator('[data-payload-path="title"]')).toHaveText('Home')
})
