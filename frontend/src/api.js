import { TOPICS } from './data/wordPacks.js'
import { CATEGORY_META } from './data/categories.js'

const SCORES_KEY = 'dictee-engels-scores'

// Categorieën die voor dit onderwerp beschikbaar zijn — "zinnen" telt alleen
// mee als het Groep 8-vinkje aan staat, ongeacht het onderwerp zelf.
function availableCategories(topic, groep8) {
  return Object.keys(topic.categories).filter((c) => c !== 'zinnen' || groep8)
}

function packName(topicName, category) {
  return category === 'alles' ? topicName : `${topicName} · ${CATEGORY_META[category].label}`
}

function buildPairs(topic, category, groep8) {
  const cats = availableCategories(topic, groep8)
  if (category === 'alles') {
    return cats.flatMap((c) => topic.categories[c].map((p) => ({ ...p, category: c })))
  }
  if (!cats.includes(category)) return null
  return topic.categories[category].map((p) => ({ ...p, category }))
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

// Alle onderwerpen gelden voor zowel Groep 7 als Groep 8 — alleen de
// categorie "zinnen" hangt af van het Groep 8-vinkje (zie getCategories).
export function getTopics() {
  return Promise.resolve(Object.keys(TOPICS))
}

// De onderdelen (woorden/werkwoorden/zinnen) die voor dit onderwerp gekozen
// kunnen worden, plus een "alles"-optie die ze allemaal combineert.
export function getCategories(topicName, groep8) {
  const topic = TOPICS[topicName]
  if (!topic) return Promise.resolve([])
  const cats = availableCategories(topic, groep8)
  const result = cats.map((category) => ({
    category,
    pairCount: topic.categories[category].length,
  }))
  const total = cats.reduce((sum, c) => sum + topic.categories[c].length, 0)
  result.push({ category: 'alles', pairCount: total })
  return Promise.resolve(result)
}

export function getPack(topicName, category, groep8) {
  const topic = TOPICS[topicName]
  if (!topic) return Promise.resolve(null)
  const pairs = buildPairs(topic, category, groep8)
  if (!pairs) return Promise.resolve(null)
  return Promise.resolve({
    id: `${topicName}::${category}`,
    name: packName(topicName, category),
    topic: topicName,
    category,
    pairs: pairs.map((p, i) => ({ id: i, english: p.english, dutch: p.dutch, hint: p.hint, category: p.category })),
  })
}

export function getScores() {
  const scores = readScores().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return Promise.resolve(scores)
}

export function postScore(score) {
  const [topicName, category] = score.packId.split('::')
  const name = TOPICS[topicName] ? packName(topicName, category) : score.packId
  const record = {
    ...score,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    pack: { name },
  }
  const scores = readScores()
  scores.push(record)
  writeScores(scores)
  return Promise.resolve(record)
}
