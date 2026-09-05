import { describe, it, expect } from 'vitest'
import { TOPICS } from './wordPacks.js'

describe('TOPICS', () => {
  it('has all eight topics, shared by both Groep 7 and Groep 8', () => {
    const names = Object.keys(TOPICS)
    expect(names).toEqual(
      expect.arrayContaining(['Activities', 'Animals', 'Creativity', 'Earth', 'People', 'Emotions', 'Style', 'Time-Celebrations'])
    )
  })

  it('every topic has a non-empty woorden category', () => {
    for (const [name, topic] of Object.entries(TOPICS)) {
      expect(topic.categories.woorden.length, `${name} woorden should not be empty`).toBeGreaterThan(0)
    }
  })

  it('every topic has a zinnen category (only surfaced for Groep 8, see api.js)', () => {
    for (const [name, topic] of Object.entries(TOPICS)) {
      expect(topic.categories.zinnen.length, `${name} zinnen should not be empty`).toBeGreaterThan(0)
    }
  })

  it('every pair in every category of every topic has non-empty english and dutch strings', () => {
    for (const topic of Object.values(TOPICS)) {
      for (const pairs of Object.values(topic.categories)) {
        for (const pair of pairs) {
          expect(typeof pair.english).toBe('string')
          expect(pair.english.length).toBeGreaterThan(0)
          expect(typeof pair.dutch).toBe('string')
          expect(pair.dutch.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('only People has no werkwoorden category', () => {
    for (const [name, topic] of Object.entries(TOPICS)) {
      if (name === 'People') {
        expect(topic.categories.werkwoorden).toBeUndefined()
      } else {
        expect(topic.categories.werkwoorden.length).toBeGreaterThan(0)
      }
    }
  })
})
