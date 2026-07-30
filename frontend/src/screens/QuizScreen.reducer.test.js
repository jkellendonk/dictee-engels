import { describe, it, expect } from 'vitest'
import { initialQuizState, reducer } from './QuizScreen.jsx'

const pack = {
  id: 'Groep 7::Test',
  name: 'Test',
  pairs: [
    { id: 0, english: 'cat', dutch: 'kat' },
    { id: 1, english: 'dog', dutch: 'hond' },
    { id: 2, english: 'bird', dutch: 'vogel' },
  ],
}

describe('initialQuizState', () => {
  it('queues every pair index exactly once', () => {
    const state = initialQuizState(pack)
    expect([...state.queue].sort()).toEqual([0, 1, 2])
    expect(state.mastered.size).toBe(0)
    expect(state.struggling.size).toBe(0)
    expect(state.finished).toBe(false)
  })
})

describe('reducer: SUBMIT', () => {
  it('a correct answer masters the word and grows the streak', () => {
    const state = initialQuizState(pack)
    const idx = state.activeIndex
    const next = reducer(state, { type: 'SUBMIT', isCorrect: true, idx })
    expect(next.answered).toBe(true)
    expect(next.lastResult).toBe('correct')
    expect(next.mastered.has(idx)).toBe(true)
    expect(next.streak).toBe(1)
    expect(next.firstTryCorrect).toBe(1)
  })

  it('a wrong answer marks it struggling and resets the streak', () => {
    let state = initialQuizState(pack)
    state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
    state = reducer(state, { type: 'ADVANCE' })
    const idx = state.activeIndex
    const next = reducer(state, { type: 'SUBMIT', isCorrect: false, idx })
    expect(next.lastResult).toBe('wrong')
    expect(next.struggling.has(idx)).toBe(true)
    expect(next.streak).toBe(0)
    expect(next.mistakes).toBe(1)
  })

  it('only counts firstTryCorrect once per word, even after a retry', () => {
    let state = initialQuizState(pack)
    const idx = state.activeIndex
    state = reducer(state, { type: 'SUBMIT', isCorrect: false, idx })
    state = reducer(state, { type: 'ADVANCE' }) // wrong answer requeues idx at the back
    // cycle through the rest of the queue back to idx
    while (state.activeIndex !== idx) {
      state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
      state = reducer(state, { type: 'ADVANCE' })
    }
    const beforeRetry = state.firstTryCorrect
    const next = reducer(state, { type: 'SUBMIT', isCorrect: true, idx })
    expect(next.firstTryCorrect).toBe(beforeRetry)
    expect(next.mastered.has(idx)).toBe(true)
  })

  it('flags a milestone every 5th consecutive correct answer', () => {
    const bigPack = { ...pack, pairs: Array.from({ length: 5 }, (_, i) => ({ id: i, english: `w${i}`, dutch: `w${i}` })) }
    let state = initialQuizState(bigPack)
    for (let i = 0; i < 4; i++) {
      state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
      expect(state.justHitMilestone).toBe(false)
      state = reducer(state, { type: 'ADVANCE' })
    }
    state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
    expect(state.streak).toBe(5)
    expect(state.justHitMilestone).toBe(true)
  })
})

describe('reducer: ADVANCE', () => {
  it('removes the word from the queue after a correct answer', () => {
    let state = initialQuizState(pack)
    const queueLenBefore = state.queue.length
    state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
    state = reducer(state, { type: 'ADVANCE' })
    expect(state.queue).toHaveLength(queueLenBefore - 1)
    expect(state.answered).toBe(false)
  })

  it('requeues the word at the back after a wrong answer', () => {
    let state = initialQuizState(pack)
    const queueLenBefore = state.queue.length
    const idx = state.activeIndex
    state = reducer(state, { type: 'SUBMIT', isCorrect: false, idx })
    state = reducer(state, { type: 'ADVANCE' })
    expect(state.queue).toHaveLength(queueLenBefore)
    expect(state.queue[state.queue.length - 1]).toBe(idx)
  })

  it('marks the round finished once the queue is empty', () => {
    let state = initialQuizState({ ...pack, pairs: [pack.pairs[0]] })
    state = reducer(state, { type: 'SUBMIT', isCorrect: true, idx: state.activeIndex })
    state = reducer(state, { type: 'ADVANCE' })
    expect(state.finished).toBe(true)
  })
})
