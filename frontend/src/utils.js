export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function normalize(str) {
  return str.trim().toLowerCase()
}

// Verwijdert interpunctie (punten, komma's, uitroeptekens, aanhalingstekens, ...)
// zodat zinnen ook goedgerekend kunnen worden als alleen de interpunctie afwijkt.
// Letters, cijfers en spaties blijven staan; dubbele spaties worden opgeschoond.
export function stripPunctuation(str) {
  return str
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Woord dat getoond wordt als vraag. Bij werkwoordvervoegingen waarbij het
// Engelse "you" geen onderscheid maakt tussen enkelvoud/meervoud (jij/jullie),
// verduidelijkt een hint welke vorm bedoeld is — alleen zichtbaar als prompt,
// nooit onderdeel van het te typen antwoord (zie answerWord).
export function promptWord(pair, direction) {
  if (direction === 'nl-en') return pair.dutch
  return pair.hint ? `${pair.english} (${pair.hint})` : pair.english
}

// Woord dat getypt moet worden als antwoord
export function answerWord(pair, direction) {
  return direction === 'nl-en' ? pair.english : pair.dutch
}

const PROMPT_NOUNS = {
  woorden: { article: 'het', noun: 'woord' },
  zinnen: { article: 'de', noun: 'zin' },
}

export function promptLabel(direction, type = 'woorden') {
  const { article, noun } = PROMPT_NOUNS[type] || PROMPT_NOUNS.woorden
  return direction === 'nl-en' ? `Typ ${article} Engelse ${noun} voor` : `Typ ${article} Nederlandse ${noun} voor`
}
