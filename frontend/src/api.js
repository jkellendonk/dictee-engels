import { WORD_PACKS } from './data/wordPacks.js'

const SCORES_KEY = 'dictee-engels-scores'

function packId(group, name) {
  return `${group}::${name}`
}

function findPack(id) {
  const [group, name] = id.split('::')
  const pairs = WORD_PACKS[group]?.[name]
  if (!pairs) return null
  return {
    id,
    name,
    group,
    pairs: pairs.map((p, i) => ({ id: i, english: p.english, dutch: p.dutch })),
  }
}

function readScores() {
  try {
    const raw = localStorage.getItem(SCORES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeScores(scores) {
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores))
}

export function getPacks(group) {
  const packs = WORD_PACKS[group] || {}
  return Promise.resolve(
    Object.entries(packs).map(([name, pairs]) => ({
      id: packId(group, name),
      name,
      group,
      pairCount: pairs.length,
    }))
  )
}

export function getPack(id) {
  return Promise.resolve(findPack(id))
}

export function getScores() {
  const scores = readScores().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return Promise.resolve(scores)
}

export function postScore(score) {
  const pack = findPack(score.packId)
  const record = {
    ...score,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    pack: { name: pack ? pack.name : score.packId },
  }
  const scores = readScores()
  scores.push(record)
  writeScores(scores)
  return Promise.resolve(record)
}
