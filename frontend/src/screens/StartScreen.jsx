import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { getTopics, getCategories } from '../api.js'
import { CATEGORY_META, ALLES_META } from '../data/categories.js'

function categoryMeta(category) {
  return category === 'alles' ? ALLES_META : CATEGORY_META[category]
}

function StartScreen({
  sound,
  playerName,
  setPlayerName,
  direction,
  setDirection,
  groep8,
  setGroep8,
  topicName,
  setTopicName,
  category,
  setCategory,
  onStart,
  onOpenBoard,
}) {
  const [topics, setTopics] = useState([])
  const [categories, setCategories] = useState([])

  // Alle onderwerpen gelden voor zowel Groep 7 als Groep 8, dus deze lijst
  // staat vast en hoeft niet opnieuw opgehaald te worden als het vinkje wisselt.
  useEffect(() => {
    getTopics().then((names) => {
      setTopics(names)
      setTopicName((current) => (current && names.includes(current) ? current : (names[0] ?? null)))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!topicName) {
      setCategories([])
      return
    }
    getCategories(topicName, groep8).then((cats) => {
      setCategories(cats)
      setCategory((current) => (current && cats.some((c) => c.category === current) ? current : 'alles'))
    })
  }, [topicName, groep8, setCategory])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (topicName && category) onStart()
  }

  return (
    <>
      <Header soundEnabled={sound.enabled} onToggleSound={sound.toggle} />
      <div className="panel">
        <h2>Wie gaat er oefenen?</h2>
        <p className="sub">Vul je naam in, kies een onderwerp en een onderdeel om te starten</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nameInput">Naam</label>
          <input
            id="nameInput"
            type="text"
            placeholder="Bijv. Sam"
            autoComplete="off"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <label className="switch-row" htmlFor="groep8Check">
            <span className="switch-text">
              Ik zit in groep 8
              <span className="switch-sub">zinnen erbij</span>
            </span>
            <span className="switch">
              <input
                id="groep8Check"
                type="checkbox"
                checked={groep8}
                onChange={(e) => setGroep8(e.target.checked)}
              />
              <span className="switch-track">
                <span className="switch-knob"></span>
              </span>
            </span>
          </label>

          <label>Richting</label>
          <div className="dir-toggle">
            <button
              type="button"
              className={`dir-btn ${direction === 'nl-en' ? 'active' : ''}`}
              onClick={() => setDirection('nl-en')}
            >
              NL ➜ EN
            </button>
            <button
              type="button"
              className={`dir-btn ${direction === 'en-nl' ? 'active' : ''}`}
              onClick={() => setDirection('en-nl')}
            >
              EN ➜ NL
            </button>
          </div>

          <label>Kies een onderwerp</label>
          <div className="topic-grid">
            {topics.map((name) => (
              <button
                key={name}
                type="button"
                data-topic={name}
                className={`topic-card ${name === topicName ? 'active' : ''}`}
                onClick={() => setTopicName(name)}
              >
                {name}
              </button>
            ))}
          </div>

          {categories.length > 0 && (
            <>
              <label>Kies een onderdeel</label>
              <div className="category-row">
                {categories.map((c) => {
                  const meta = categoryMeta(c.category)
                  return (
                    <button
                      key={c.category}
                      type="button"
                      data-category={c.category}
                      className={`category-chip ${c.category === category ? 'active' : ''}`}
                      style={meta.color ? { '--chip-color': meta.color } : undefined}
                      onClick={() => setCategory(c.category)}
                    >
                      <span aria-hidden="true">{meta.icon}</span>
                      {meta.label}
                      <span className="chip-count">{c.pairCount}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <button type="submit" className="start-btn" disabled={!topicName || !category}>
            Start! ➜
          </button>
        </form>
        <button
          className="ghost-btn"
          style={{ width: '100%', marginTop: 12 }}
          onClick={onOpenBoard}
        >
          🏆 Bekijk scorebord
        </button>
      </div>
    </>
  )
}

export default StartScreen
