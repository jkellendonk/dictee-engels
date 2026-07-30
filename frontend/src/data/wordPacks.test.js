import { describe, it, expect } from 'vitest'
import { WORD_PACKS } from './wordPacks.js'

describe('WORD_PACKS', () => {
  it('has an entry for Groep 7 and Groep 8', () => {
    expect(WORD_PACKS).toHaveProperty('Groep 7')
    expect(WORD_PACKS).toHaveProperty('Groep 8')
  })

  it('Groep 8 has no packs yet', () => {
    expect(Object.keys(WORD_PACKS['Groep 8'])).toEqual([])
  })

  it('every Groep 7 pack has at least one pair', () => {
    for (const [name, pairs] of Object.entries(WORD_PACKS['Groep 7'])) {
      expect(pairs.length, `${name} should not be empty`).toBeGreaterThan(0)
    }
  })

  it('every pair has non-empty english and dutch strings', () => {
    for (const pairs of Object.values(WORD_PACKS['Groep 7'])) {
      for (const pair of pairs) {
        expect(typeof pair.english).toBe('string')
        expect(pair.english.length).toBeGreaterThan(0)
        expect(typeof pair.dutch).toBe('string')
        expect(pair.dutch.length).toBeGreaterThan(0)
      }
    }
  })
})
