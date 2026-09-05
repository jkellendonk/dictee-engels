// Metadata voor de drie oefen-onderdelen binnen een onderwerp. Wordt gebruikt
// om zowel de keuze-chips (StartScreen) als het kleurtje/icoontje per vraag
// (QuizScreen) consistent te tekenen.
export const CATEGORY_META = {
  woorden: { label: 'Woordjes', icon: '📖', color: 'var(--teal)' },
  werkwoorden: { label: 'Werkwoorden', icon: '🏃', color: 'var(--gold)' },
  zinnen: { label: 'Zinnen', icon: '💬', color: 'var(--mint)' },
}

// "Alles" is geen echte categorie (elke vraag erin behoudt haar eigen
// woorden/werkwoorden/zinnen-kleurtje) maar een keuze die ze combineert.
export const ALLES_META = { label: 'Alles', icon: '🎯' }
