import { test, expect } from '@playwright/test'

test('shows the app title and all eight topics regardless of Groep 8', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Dictee Engels')
  await expect(page.locator('h1')).toHaveText('Dictee Engels')

  await expect(page.locator('#groep8Check')).not.toBeChecked()
  for (const name of ['Activities', 'Animals', 'Creativity', 'Earth', 'People', 'Emotions', 'Style', 'Time-Celebrations']) {
    await expect(page.locator(`[data-topic="${name}"]`)).toBeVisible()
  }
  // Zonder het Groep 8-vinkje is er geen zinnen-onderdeel, wel woorden/werkwoorden/alles.
  await expect(page.locator('[data-category="zinnen"]')).toHaveCount(0)
  await expect(page.locator('[data-category="woorden"]')).toBeVisible()
  await expect(page.locator('[data-category="werkwoorden"]')).toBeVisible()
  await expect(page.locator('[data-category="alles"]')).toBeVisible()
})

test('checking Groep 8 only reveals the zinnen onderdeel, not new topics', async ({ page }) => {
  await page.goto('/')
  const topicCountBefore = await page.locator('.topic-card').count()

  await page.locator('.switch-row').click()

  await expect(page.locator('.topic-card')).toHaveCount(topicCountBefore)
  await expect(page.locator('[data-category="zinnen"]')).toBeVisible()
})

test('unchecking Groep 8 while zinnen is selected falls back to alles', async ({ page }) => {
  await page.goto('/')
  await page.locator('.switch-row').click()
  await page.locator('[data-category="zinnen"]').click()
  await expect(page.locator('[data-category="zinnen"]')).toHaveClass(/active/)

  await page.locator('.switch-row').click()
  await expect(page.locator('[data-category="zinnen"]')).toHaveCount(0)
  await expect(page.locator('[data-category="alles"]')).toHaveClass(/active/)
})

test('board screen shows an empty state when nothing has been played yet', async ({ page }) => {
  await page.goto('/')
  await page.locator('button', { hasText: 'Bekijk scorebord' }).click()
  await expect(page.getByText('Hier komt de voortgang te staan')).toBeVisible()
})
