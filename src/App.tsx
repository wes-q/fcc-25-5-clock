import TimerClock from './TimerClock'
import './App.css'
import tomato from './assets/tomato.svg'

function App() {
  
  return (
    <>
      <img className='tomato' src={tomato} alt="tomato" />
      <h1>Pom<span className="material-symbols-outlined">timer</span>doro Tecnique</h1>
      <h2 style={{ fontStyle: 'italic' }}>"A method for staying focused and mentally fresh"</h2>
      <div className='center'>
        <ol>
          <li>Set a 25 minute session timer</li>
          <li>Work on your task until the time is up</li>
          <li>Take a 5 minute break</li>
        </ol>
      </div>
      <TimerClock />
    </>
  )
}

export default App