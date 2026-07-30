import { describe, it, expect, beforeEach } from 'vitest'
import { getPacks, getPack, getScores, postScore } from './api.js'
import { WORD_PACKS } from './data/wordPacks.js'

beforeEach(() => {
  localStorage.clear()
})

describe('getPacks', () => {
  it('returns every Groep 7 pack with a pairCount', async () => {
    const packs = await getPacks('Groep 7')
    const expectedNames = Object.keys(WORD_PACKS['Groep 7'])
    expect(packs.map((p) => p.name).sort()).toEqual([...expectedNames].sort())
    for (const pack of packs) {
      expect(pack.pairCount).toBe(WORD_PACKS['Groep 7'][pack.name].length)
      expect(pack.id).toBe(`Groep 7::${pack.name}`)
    }
  })

  it('returns an empty list for a group with no packs yet', async () => {
    const packs = await getPacks('Groep 8')
    expect(packs).toEqual([])
  })

  it('returns an empty list for an unknown group', async () => {
    const packs = await getPacks('Groep 12')
    expect(packs).toEqual([])
  })
})

describe('getPack', () => {
  it('resolves a valid pack id with all its pairs', async () => {
    const pack = await getPack('Groep 7::Animals')
    expect(pack.name).toBe('Animals')
    expect(pack.group).toBe('Groep 7')
    expect(pack.pairs).toHaveLength(WORD_PACKS['Groep 7'].Animals.length)
    expect(pack.pairs[0]).toEqual(
      expect.objectContaining({ id: 0, english: expect.any(String), dutch: expect.any(String) })
    )
  })

  it('returns null for an unknown pack id', async () => {
    const pack = await getPack('Groep 7::DoesNotExist')
    expect(pack).toBeNull()
  })
})

describe('scores (localStorage)', () => {
  it('starts empty', async () => {
    expect(await getScores()).toEqual([])
  })

  it('postScore stores a record with a resolved pack name, id and createdAt', async () => {
    const saved = await postScore({
      playerName: 'Sam',
      packId: 'Groep 7::Animals',
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

    expect(saved.pack).toEqual({ name: 'Animals' })
    expect(saved.id).toBeDefined()
    expect(saved.createdAt).toBeDefined()

    const scores = await getScores()
    expect(scores).toHaveLength(1)
    expect(scores[0].playerName).toBe('Sam')
  })

  it('falls back to the raw packId when the pack can no longer be resolved', async () => {
    const saved = await postScore({ playerName: 'Sam', packId: 'Groep 9::Ghost', direction: 'nl-en' })
    expect(saved.pack).toEqual({ name: 'Groep 9::Ghost' })
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
