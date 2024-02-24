import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Details } from './Details'
import Card from './Card'
import Cal2 from './Cal2'
import FullCal from './FullCal'
import Canvas from './Canvas'
import HistoryProvider, { HistoryContext, useHistory } from './History'

function App() {
  const [count, setCount] = useState(0)
  

  
  return (
    <HistoryProvider>
      <Canvas />
    </HistoryProvider>
  )
}

export default App
