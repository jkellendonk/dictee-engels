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

export function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Woord dat getoond wordt als vraag
export function promptWord(pair, direction) {
  return direction === 'nl-en' ? pair.dutch : pair.english
}

// Woord dat getypt moet worden als antwoord
export function answerWord(pair, direction) {
  return direction === 'nl-en' ? pair.english : pair.dutch
}

export function promptLabel(direction) {
  return direction === 'nl-en'
    ? 'Typ het Engelse woord voor'
    : 'Typ het Nederlandse woord voor'
}
