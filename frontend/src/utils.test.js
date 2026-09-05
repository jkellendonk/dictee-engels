import { describe, it, expect } from 'vitest'
import { shuffle, normalize, stripPunctuation, fmtTime, promptWord, answerWord, promptLabel } from './utils.js'

describe('shuffle', () => {
  it('keeps the same elements (multiset) and length', () => {
    const input = [0, 1, 2, 3, 4, 5, 6, 7]
    const result = shuffle(input)
    expect(result).toHaveLength(input.length)
    expect([...result].sort()).toEqual([...input].sort())
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })
})

describe('normalize', () => {
  it('trims whitespace and lowercases', () => {
    expect(normalize('  Hello World  ')).toBe('hello world')
  })

  it('leaves an already-normalized string unchanged', () => {
    expect(normalize('cat')).toBe('cat')
  })
})

describe('stripPunctuation', () => {
  it('removes sentence punctuation but keeps letters, numbers and spaces', () => {
    expect(stripPunctuation('My dog is very happy!')).toBe('My dog is very happy')
    expect(stripPunctuation("It's busy in the city!")).toBe('Its busy in the city')
    expect(stripPunctuation('30 degrees Celsius.')).toBe('30 degrees Celsius')
  })

  it('collapses whitespace left behind by removed punctuation', () => {
    expect(stripPunctuation('Wait, what?')).toBe('Wait what')
  })

  it('leaves a string without punctuation unchanged', () => {
    expect(stripPunctuation('hello world')).toBe('hello world')
  })
})

describe('fmtTime', () => {
  it('formats zero seconds', () => {
    expect(fmtTime(0)).toBe('0:00')
  })

  it('pads single-digit seconds', () => {
    expect(fmtTime(65)).toBe('1:05')
  })

  it('formats multiple minutes', () => {
    expect(fmtTime(125)).toBe('2:05')
  })
})

const pair = { english: 'cat', dutch: 'kat' }

describe('promptWord / answerWord', () => {
  it('nl-en shows dutch and expects english', () => {
    expect(promptWord(pair, 'nl-en')).toBe('kat')
    expect(answerWord(pair, 'nl-en')).toBe('cat')
  })

  it('en-nl shows english and expects dutch', () => {
    expect(promptWord(pair, 'en-nl')).toBe('cat')
    expect(answerWord(pair, 'en-nl')).toBe('kat')
  })
})

describe('promptLabel', () => {
  it('nl-en asks for the English word', () => {
    expect(promptLabel('nl-en')).toMatch(/Engelse/)
  })

  it('en-nl asks for the Dutch word', () => {
    expect(promptLabel('en-nl')).toMatch(/Nederlandse/)
  })
})
