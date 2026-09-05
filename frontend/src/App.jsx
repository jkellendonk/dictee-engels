import { useState } from 'react'
import { useSound } from './hooks/useSound.js'
import { getPack } from './api.js'
import StartScreen from './screens/StartScreen.jsx'
import QuizScreen from './screens/QuizScreen.jsx'
import ResultScreen from './screens/ResultScreen.jsx'
import BoardScreen from './screens/BoardScreen.jsx'

function App() {
  const sound = useSound()
  const [screen, setScreen] = useState('start')
  const [playerName, setPlayerName] = useState('')
  const [activePlayerName, setActivePlayerName] = useState('Speler')
  const [direction, setDirection] = useState('nl-en')
  const [groep8, setGroep8] = useState(false)
  const [topicName, setTopicName] = useState(null)
  const [category, setCategory] = useState(null)
  const [pack, setPack] = useState(null)
  const [result, setResult] = useState(null)

  const startQuiz = async () => {
    const fullPack = await getPack(topicName, category, groep8)
    setActivePlayerName(playerName.trim() || 'Speler')
    setPack(fullPack)
    setResult(null)
    setScreen('quiz')
  }

  return (
    <div className="app">
      {screen === 'start' && (
        <StartScreen
          sound={sound}
          playerName={playerName}
          setPlayerName={setPlayerName}
          direction={direction}
          setDirection={setDirection}
          groep8={groep8}
          setGroep8={setGroep8}
          topicName={topicName}
          setTopicName={setTopicName}
          category={category}
          setCategory={setCategory}
          onStart={startQuiz}
          onOpenBoard={() => setScreen('board')}
        />
      )}

      {screen === 'quiz' && pack && (
        <QuizScreen
          key={`${pack.id}-${direction}`}
          pack={pack}
          direction={direction}
          playerName={activePlayerName}
          sound={sound}
          onFinish={(r) => {
            setResult(r)
            setScreen('result')
          }}
          onBackToMenu={() => setScreen('start')}
        />
      )}

      {screen === 'result' && pack && result && (
        <ResultScreen
          pack={pack}
          direction={direction}
          playerName={activePlayerName}
          result={result}
          sound={sound}
          onPlayAgain={startQuiz}
          onChangePack={() => setScreen('start')}
          onOpenBoard={() => setScreen('board')}
        />
      )}

      {screen === 'board' && <BoardScreen sound={sound} onBack={() => setScreen('start')} />}
    </div>
  )
}

export default App
