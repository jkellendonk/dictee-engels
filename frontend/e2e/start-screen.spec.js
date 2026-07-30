import { test, expect } from '@playwright/test'

test('shows the app title and all Groep 7 packs by default', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Dictee Engels')
  await expect(page.locator('h1')).toHaveText('Dictee Engels')

  const packNames = ['Activities', 'Animals', 'Creativity', 'Earth', 'People']
  for (const name of packNames) {
    await expect(page.locator('.pack-card .pname', { hasText: name })).toBeVisible()
  }
  await expect(page.locator('.dir-btn', { hasText: 'Groep 7' })).toHaveClass(/active/)
})

test('Groep 8 shows an empty state and disables the start button', async ({ page }) => {
  await page.goto('/')
  await page.locator('.dir-btn', { hasText: 'Groep 8' }).click()

  await expect(page.locator('.pack-card')).toHaveCount(0)
  await expect(page.getByText(/Nog geen woordpakketten voor Groep 8/)).toBeVisible()
  await expect(page.locator('.start-btn')).toBeDisabled()
})

test('board screen shows an empty state when nothing has been played yet', async ({ page }) => {
  await page.goto('/')
  await page.locator('button', { hasText: 'Bekijk scorebord' }).click()
  await expect(page.getByText('Hier komt de voortgang te staan')).toBeVisible()
})
