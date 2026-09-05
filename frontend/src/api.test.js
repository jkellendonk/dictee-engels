import { describe, it, expect, beforeEach } from 'vitest'
import { getTopics, getCategories, getPack, getScores, postScore } from './api.js'

beforeEach(() => {
  localStorage.clear()
})

describe('getTopics', () => {
  it('always returns every topic — Groep 7 and Groep 8 share the same onderwerpen', async () => {
    const topics = await getTopics()
    expect(topics).toEqual(
      expect.arrayContaining(['Activities', 'Animals', 'Creativity', 'Earth', 'People', 'Emotions', 'Style', 'Time-Celebrations'])
    )
  })
})

describe('getCategories', () => {
  it('excludes zinnen and includes an alles option when groep8 is false', async () => {
    const cats = await getCategories('Animals', false)
    const names = cats.map((c) => c.category)
    expect(names).toEqual(expect.arrayContaining(['woorden', 'werkwoorden', 'alles']))
    expect(names).not.toContain('zinnen')
    const alles = cats.find((c) => c.category === 'alles')
    const woorden = cats.find((c) => c.category === 'woorden')
    const werkwoorden = cats.find((c) => c.category === 'werkwoorden')
    expect(alles.pairCount).toBe(woorden.pairCount + werkwoorden.pairCount)
  })

  it('includes zinnen when groep8 is true, folded into alles too', async () => {
    const cats = await getCategories('Animals', true)
    const names = cats.map((c) => c.category)
    expect(names).toEqual(expect.arrayContaining(['woorden', 'werkwoorden', 'zinnen', 'alles']))
    const total = cats.filter((c) => c.category !== 'alles').reduce((sum, c) => sum + c.pairCount, 0)
    expect(cats.find((c) => c.category === 'alles').pairCount).toBe(total)
  })

  it('Emotions (a topic that used to be Groep-8-only) works for both groups too', async () => {
    const withoutGroep8 = await getCategories('Emotions', false)
    expect(withoutGroep8.map((c) => c.category)).toEqual(expect.arrayContaining(['woorden', 'werkwoorden', 'alles']))
    expect(withoutGroep8.map((c) => c.category)).not.toContain('zinnen')
  })

  it('People has no werkwoorden option', async () => {
    const cats = await getCategories('People', true)
    expect(cats.map((c) => c.category)).not.toContain('werkwoorden')
  })
})

describe('getPack', () => {
  it('resolves a single category with tagged pairs', async () => {
    const pack = await getPack('Animals', 'woorden', false)
    expect(pack.id).toBe('Animals::woorden')
    expect(pack.topic).toBe('Animals')
    expect(pack.category).toBe('woorden')
    expect(pack.pairs.length).toBeGreaterThan(0)
    for (const pair of pack.pairs) {
      expect(pair.category).toBe('woorden')
    }
  })

  it('"alles" combines every available category and tags each pair with its own category', async () => {
    const woorden = await getPack('Animals', 'woorden', false)
    const werkwoorden = await getPack('Animals', 'werkwoorden', false)
    const alles = await getPack('Animals', 'alles', false)
    expect(alles.pairs.length).toBe(woorden.pairs.length + werkwoorden.pairs.length)
    expect(new Set(alles.pairs.map((p) => p.category))).toEqual(new Set(['woorden', 'werkwoorden']))
  })

  it('"alles" also includes zinnen once groep8 is true', async () => {
    const withoutGroep8 = await getPack('Animals', 'alles', false)
    const withGroep8 = await getPack('Animals', 'alles', true)
    expect(withGroep8.pairs.length).toBeGreaterThan(withoutGroep8.pairs.length)
    expect(withGroep8.pairs.some((p) => p.category === 'zinnen')).toBe(true)
  })

  it('returns null for zinnen when groep8 is false', async () => {
    expect(await getPack('Animals', 'zinnen', false)).toBeNull()
  })

  it('Emotions resolves fine without groep8 too — only zinnen is gated', async () => {
    expect(await getPack('Emotions', 'woorden', false)).not.toBeNull()
  })

  it('returns null for an unknown topic or category', async () => {
    expect(await getPack('DoesNotExist', 'woorden', true)).toBeNull()
    expect(await getPack('Animals', 'DoesNotExist', true)).toBeNull()
  })

  it('a hinted "you"-vervoeging keeps its hint through getPack', async () => {
    const pack = await getPack('Animals', 'werkwoorden', false)
    const hinted = pack.pairs.filter((p) => p.english === 'you are')
    expect(hinted).toHaveLength(2)
    expect(hinted.map((p) => p.hint).sort()).toEqual(['jij', 'jullie'])
  })
})

describe('scores (localStorage)', () => {
  it('starts empty', async () => {
    expect(await getScores()).toEqual([])
  })

  it('postScore stores a record with a resolved pack name, id and createdAt', async () => {
    const saved = await postScore({
      playerName: 'Sam',
      packId: 'Animals::woorden',
      direction: 'nl-en',
      totalWords: 10,
      firstTryCorrect: 9,
      accuracy: 90,
      mistakes: 1,
      timeSeconds: 30,
      wpm: 20,
      bestStreak: 9,
      stars: 3,
    })

    expect(saved.pack).toEqual({ name: 'Animals · Woordjes' })
    expect(saved.id).toBeDefined()
    expect(saved.createdAt).toBeDefined()

    const scores = await getScores()
    expect(scores).toHaveLength(1)
    expect(scores[0].playerName).toBe('Sam')
  })

  it('uses just the topic name for "alles"', async () => {
    const saved = await postScore({ playerName: 'Sam', packId: 'Animals::alles', direction: 'nl-en' })
    expect(saved.pack).toEqual({ name: 'Animals' })
  })

  it('falls back to the raw packId when the pack can no longer be resolved', async () => {
    const saved = await postScore({ playerName: 'Sam', packId: 'Ghost::woorden', direction: 'nl-en' })
    expect(saved.pack).toEqual({ name: 'Ghost::woorden' })
  })

  it('getScores sorts newest first', async () => {
    localStorage.setItem(
      'dictee-engels-scores',
      JSON.stringify([
        { id: 1, playerName: 'Oud', createdAt: '2026-01-01T00:00:00.000Z', pack: { name: 'Animals' } },
        { id: 2, playerName: 'Nieuw', createdAt: '2026-06-01T00:00:00.000Z', pack: { name: 'Animals' } },
      ])
    )
    const scores = await getScores()
    expect(scores.map((s) => s.playerName)).toEqual(['Nieuw', 'Oud'])
  })
})
