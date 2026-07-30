import { test, expect } from '@playwright/test'
import { WORD_PACKS } from '../src/data/wordPacks.js'

const animalsPairs = WORD_PACKS['Groep 7'].Animals
const nlToEn = Object.fromEntries(animalsPairs.map((p) => [p.dutch, p.english]))

async function startAnimalsQuiz(page, playerName = 'E2ETest') {
  await page.goto('/')
  await page.fill('#nameInput', playerName)
  await page.locator('.pack-card', { hasText: 'Animals' }).click()
  await page.locator('.start-btn').click()
  await expect(page.locator('.prompt-word')).toBeVisible()
}

async function currentCorrectAnswer(page) {
  const shown = await page.locator('.prompt-word').innerText()
  return nlToEn[shown.trim()]
}

async function answer(page, value) {
  await page.fill('.answer-row input', value)
  await page.keyboard.press('Enter')
  await page
    .waitForFunction(() => {
      const input = document.querySelector('.answer-row input')
      return document.querySelector('.result-title') || (input && !input.disabled)
    })
    .catch(() => {})
}

async function finishQuiz(page) {
  for (let i = 0; i < animalsPairs.length + 5; i++) {
    if (await page.locator('.result-title').count()) return
    await answer(page, await currentCorrectAnswer(page))
  }
}

test('a wrong answer shows feedback with the correct word and resets the streak', async ({ page }) => {
  await startAnimalsQuiz(page)

  // Build a streak of 1 first
  await answer(page, await currentCorrectAnswer(page))
  await expect(page.locator('.streak-badge')).toContainText('1 op een rij')

  const correct = await currentCorrectAnswer(page)
  await page.fill('.answer-row input', 'dit-is-zeker-fout')
  await page.keyboard.press('Enter')

  await expect(page.locator('.msg.bad')).toContainText(correct)
  await expect(page.locator('.answer-row input')).toHaveValue(correct)
  await expect(page.locator('.streak-badge')).toContainText('0 op een rij')
})

test('completing a full pack reaches the result screen with correct stats', async ({ page }) => {
  await startAnimalsQuiz(page)
  await finishQuiz(page)

  await expect(page.locator('.result-title')).toContainText('Animals')
  await expect(page.locator('.metric .mval').first()).toHaveText('100%')
  await expect(page.getByText('Nieuw persoonlijk record')).toBeVisible()
})

test('a score is saved to the board and survives a reload (localStorage)', async ({ page }) => {
  await startAnimalsQuiz(page, 'BoardTester')
  await finishQuiz(page)
  await expect(page.locator('.result-title')).toBeVisible()

  await page.locator('button', { hasText: 'Volledig scorebord' }).click()
  await expect(page.getByText('BoardTester')).toBeVisible()

  await page.reload()
  await page.locator('button', { hasText: 'Bekijk scorebord' }).click()
  await expect(page.getByText('BoardTester')).toBeVisible()
})

test('the "back to menu" button shows a custom confirm modal, not a native popup', async ({ page }) => {
  await startAnimalsQuiz(page)
  await page.locator('button', { hasText: 'Hoofdmenu' }).click()

  const modal = page.locator('.dialog-card')
  await expect(modal).toBeVisible()
  await expect(modal.locator('.dialog-title')).toHaveText('Stoppen met deze ronde?')

  // "Verder spelen" closes the modal and keeps the quiz running
  await modal.locator('button', { hasText: 'Verder spelen' }).click()
  await expect(modal).not.toBeVisible()
  await expect(page.locator('.prompt-word')).toBeVisible()

  // Reopen, then confirm stopping actually returns to the start screen
  await page.locator('button', { hasText: 'Hoofdmenu' }).click()
  await page.locator('.dialog-card button', { hasText: 'Ja, stoppen' }).click()
  await expect(page.locator('#nameInput')).toBeVisible()
})

test('Escape closes the confirm modal', async ({ page }) => {
  await startAnimalsQuiz(page)
  await page.locator('button', { hasText: 'Hoofdmenu' }).click()
  await expect(page.locator('.dialog-card')).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.locator('.dialog-card')).not.toBeVisible()
})
