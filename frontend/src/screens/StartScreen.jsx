import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import { getPacks } from '../api.js'

const GROUPS = ['Groep 7', 'Groep 8']

function StartScreen({
  sound,
  playerName,
  setPlayerName,
  direction,
  setDirection,
  group,
  setGroup,
  packId,
  setPackId,
  onStart,
  onOpenBoard,
}) {
  const [packs, setPacks] = useState([])

  useEffect(() => {
    setPackId(null)
    getPacks(group).then((data) => {
      setPacks(data)
      if (data.length > 0) setPackId(data[0].id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (packId) onStart()
  }

  return (
    <>
      <Header soundEnabled={sound.enabled} onToggleSound={sound.toggle} />
      <div className="panel">
        <h2>Wie gaat er oefenen?</h2>
        <p className="sub">Vul je naam in, kies een groep, richting en een pakket om te starten</p>
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

          <label>Groep</label>
          <div className="dir-toggle">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                className={`dir-btn ${group === g ? 'active' : ''}`}
                onClick={() => setGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>

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

          <label>Kies een pakket</label>
          {packs.length === 0 ? (
            <p className="sub">Nog geen woordpakketten voor {group}. Kies een andere groep.</p>
          ) : (
            <div className="pack-grid">
              {packs.map((p) => (
                <div
                  key={p.id}
                  className={`pack-card ${p.id === packId ? 'active' : ''}`}
                  onClick={() => setPackId(p.id)}
                >
                  <div className="pname">{p.name}</div>
                  <div className="pcount">{p.pairCount} woorden</div>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="start-btn" disabled={!packId}>
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
