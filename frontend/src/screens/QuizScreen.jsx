import { useEffect, useReducer, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import Modal from '../components/Modal.jsx'
import { normalize, stripPunctuation, fmtTime, shuffle, promptWord, answerWord, promptLabel } from '../utils.js'
import { CATEGORY_META } from '../data/categories.js'

const PRAISE = ['Goed zo!', 'Top!', 'Knap gedaan!', 'Yes!']

export function initialQuizState(pack) {
  const queue = shuffle(pack.pairs.map((_, i) => i))
  return {
    queue,
    activeIndex: queue[0],
    mastered: new Set(),
    struggling: new Set(),
    mistakes: 0,
    firstTryCorrect: 0,
    attemptedFirstTime: new Set(),
    streak: 0,
    bestStreak: 0,
    justHitMilestone: false,
    answered: false,
    lastResult: null,
    message: '',
    finished: false,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'SUBMIT': {
      const { isCorrect, punctuationOnly, idx } = action
      const isFirstAttempt = !state.attemptedFirstTime.has(idx)
      const attemptedFirstTime = new Set(state.attemptedFirstTime)
      if (isFirstAttempt) attemptedFirstTime.add(idx)

      if (isCorrect) {
        const streak = state.streak + 1
        const mastered = new Set(state.mastered).add(idx)
        const struggling = new Set(state.struggling)
        struggling.delete(idx)
        return {
          ...state,
          answered: true,
          lastResult: punctuationOnly ? 'warn' : 'correct',
          mastered,
          struggling,
          firstTryCorrect: state.firstTryCorrect + (isFirstAttempt ? 1 : 0),
          attemptedFirstTime,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          justHitMilestone: streak > 0 && streak % 5 === 0,
          message: punctuationOnly
            ? 'Let op interpunctie!'
            : PRAISE[Math.floor(Math.random() * PRAISE.length)],
        }
      }
      return {
        ...state,
        answered: true,
        lastResult: 'wrong',
        mistakes: state.mistakes + 1,
        struggling: new Set(state.struggling).add(idx),
        attemptedFirstTime,
        streak: 0,
        justHitMilestone: false,
        message: '',
      }
    }
    case 'ADVANCE': {
      const queue = state.queue.slice(1)
      if (state.lastResult === 'wrong') queue.push(state.activeIndex)
      if (queue.length === 0) return { ...state, finished: true }
      return {
        ...state,
        queue,
        activeIndex: queue[0],
        answered: false,
        lastResult: null,
        justHitMilestone: false,
        message: '',
      }
    }
    default:
      return state
  }
}

function QuizScreen({ pack, direction, playerName, sound, onFinish, onBackToMenu }) {
  const [state, dispatch] = useReducer(reducer, pack, initialQuizState)
  const [elapsed, setElapsed] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const startedAtRef = useRef(Date.now())
  const inputRef = useRef(null)

  const pair = pack.pairs[state.activeIndex]
  const shownWord = promptWord(pair, direction)
  const correctAnswer = answerWord(pair, direction)
  const categoryMeta = CATEGORY_META[pair.category]

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const submitAnswer = () => {
    if (state.answered) return
    const value = inputRef.current ? inputRef.current.value : ''
    const exactMatch = normalize(value) === normalize(correctAnswer)
    // Bij zinnen mag interpunctie de enige afwijking zijn: dan telt het als
    // goed, met een waarschuwing in plaats van "fout".
    const punctuationOnlyMatch =
      !exactMatch &&
      pair.category === 'zinnen' &&
      normalize(stripPunctuation(value)) === normalize(stripPunctuation(correctAnswer))
    dispatch({
      type: 'SUBMIT',
      isCorrect: exactMatch || punctuationOnlyMatch,
      punctuationOnly: punctuationOnlyMatch,
      idx: state.activeIndex,
    })
  }

  useEffect(() => {
    if (!state.answered) return
    if (state.justHitMilestone) sound.playStreak()
    else if (state.lastResult === 'wrong') sound.playWrong()
    else sound.playCorrect()

    if (inputRef.current) {
      inputRef.current.classList.remove('correct', 'warn', 'wrong')
      if (state.lastResult === 'wrong') {
        inputRef.current.classList.add('wrong')
        inputRef.current.value = correctAnswer
      } else {
        inputRef.current.classList.add(state.lastResult === 'warn' ? 'warn' : 'correct')
      }
    }

    const delay = state.lastResult === 'wrong' ? 1700 : state.lastResult === 'warn' ? 1300 : 700
    const t = setTimeout(() => dispatch({ type: 'ADVANCE' }), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.answered, state.lastResult, state.justHitMilestone])

  useEffect(() => {
    if (state.answered) return
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.classList.remove('correct', 'warn', 'wrong')
      inputRef.current.focus()
    }
  }, [state.answered, state.activeIndex])

  useEffect(() => {
    if (!state.finished) return
    const totalWords = pack.pairs.length
    const accuracy = Math.round((state.firstTryCorrect / totalWords) * 100)
    let stars = 1
    if (accuracy >= 90) stars = 3
    else if (accuracy >= 70) stars = 2
    sound.playFinish()
    onFinish({
      totalWords,
      firstTryCorrect: state.firstTryCorrect,
      accuracy,
      mistakes: state.mistakes,
      timeSeconds: elapsed,
      wpm: Math.round((totalWords / Math.max(elapsed, 1)) * 60 * 10) / 10,
      bestStreak: state.bestStreak,
      stars,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.finished])

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter') return
      if (showConfirm) return
      if (!state.answered) submitAnswer()
      else dispatch({ type: 'ADVANCE' })
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.answered, correctAnswer, showConfirm])

  const requestBackToMenu = () => setShowConfirm(true)

  const trail = pack.pairs.map((_, i) => {
    let cls = 'step'
    if (state.mastered.has(i)) cls += ' mastered'
    else if (i === state.activeIndex && !state.answered) cls += ' current'
    else if (state.struggling.has(i)) cls += ' struggling'
    return <div key={i} className={cls}></div>
  })

  return (
    <>
      <Header
        soundEnabled={sound.enabled}
        onToggleSound={sound.toggle}
        right={
          <>
            <div className="player-badge">👤 {playerName} &middot; {pack.name}</div>
            <button className="menu-btn" onClick={requestBackToMenu}>🏠 Hoofdmenu</button>
          </>
        }
      />

      <div className="top-bar">
        <span className="streak-badge">🔥 {state.streak} op een rij</span>
        <span className="timer">⏱ <span>{fmtTime(elapsed)}</span></span>
      </div>

      {state.answered && state.justHitMilestone && (
        <div className="milestone-banner">🎉 {state.streak} op een rij! Knap gedaan!</div>
      )}

      <div className="trail-wrap">
        <div className="trail">{trail}</div>
        <div className="trail-meta">
          <span>{state.mastered.size} / {pack.pairs.length} onder de knie</span>
          <span>{state.mistakes} foutjes tot nu toe</span>
        </div>
      </div>

      <div
        className={`msg ${
          state.lastResult === 'correct' ? 'good' : state.lastResult === 'warn' ? 'warn' : state.lastResult === 'wrong' ? 'bad' : ''
        }`}
      >
        {state.lastResult === 'correct' && state.message}
        {state.lastResult === 'warn' && (
          <>⚠️ {state.message} Officieel: <u>{correctAnswer}</u></>
        )}
        {state.lastResult === 'wrong' && (
          <>Bijna! Het juiste woord is: <u>{correctAnswer}</u>. Komt later terug.</>
        )}
      </div>

      <div className="stage">
        <div className="prompt-card">
          {categoryMeta && (
            <div className="category-badge" style={{ '--chip-color': categoryMeta.color }}>
              <span className="dot" aria-hidden="true"></span>
              {categoryMeta.icon} {categoryMeta.label}
            </div>
          )}
          <div className="prompt-label">{promptLabel(direction, pair.category)}</div>
          <div className="prompt-word">{shownWord}</div>
        </div>
      </div>

      <div className="answer-row">
        <input
          ref={inputRef}
          type="text"
          placeholder="jouw antwoord..."
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={state.answered}
        />
        <button className="check-btn" disabled={state.answered} onClick={submitAnswer}>
          Controleer
        </button>
      </div>
      <div className="hint">Druk op Enter: je antwoord wordt gecontroleerd en je gaat vanzelf verder</div>

      <div className="footer">
        <div className="score"><span>Onder de knie</span> <b>{state.mastered.size} / {pack.pairs.length}</b></div>
        <button
          className="next-btn"
          disabled={!state.answered}
          onClick={() => dispatch({ type: 'ADVANCE' })}
        >
          {state.answered ? (state.queue.length === 1 ? 'Nu naar score ➜' : 'Nu al verder ➜') : 'Volgende ➜'}
        </button>
      </div>

      {showConfirm && (
        <Modal
          title="Stoppen met deze ronde?"
          onClose={() => setShowConfirm(false)}
          secondaryAction={{ label: 'Ja, stoppen', onClick: onBackToMenu }}
          primaryAction={{ label: 'Verder spelen', onClick: () => setShowConfirm(false) }}
        >
          Je voortgang in dit pakket gaat dan verloren.
        </Modal>
      )}
    </>
  )
}

export default QuizScreen
