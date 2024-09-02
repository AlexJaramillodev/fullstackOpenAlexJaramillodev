import { useState } from 'react'
import './App.css'


const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [promedio, setPromedio] = useState(0)
  const [porcentajeGood, setPorcentajeGood] = useState(0)


  const handleGoodClick = () =>{
    const updateGood = good +1
    setGood(updateGood)
    
    const newTotal = updateGood + neutral + bad
    setTotal(newTotal)
    setPromedio ( (updateGood - bad) / newTotal)

    const porcentaje = (updateGood / newTotal) * 100
    setPorcentajeGood(porcentaje)
   
    
  }

  const handleNeutralClick = () =>{
    const updateNeutral = neutral + 1
    setNeutral(updateNeutral)
    
    const newTotal = good +  updateNeutral + bad
    setTotal(newTotal)
    setPromedio( (good - bad) / newTotal)

    const porcentaje = (good / newTotal) * 100
    setPorcentajeGood(porcentaje)

    
  }

  const handleBadClick = () =>{
    const updateBad = bad + 1
    setBad(updateBad)
    
    const newTotal = good + neutral + updateBad
    setTotal(newTotal )
    setPromedio((good - updateBad) / newTotal)

    const porcentaje = (good / newTotal) * 100
    setPorcentajeGood(porcentaje)
    
  }

  return (
    <div>
      <h1>UNICAFE</h1>
      <h2>Give Feedback</h2>
      <button onClick={handleGoodClick}>Good</button>
      <button onClick={handleNeutralClick}>Neutral</button>
      <button onClick={handleBadClick}>Bad</button>
      
      <h2>Statics</h2>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>total: {total}</p>
      <p>Promedio: {promedio}</p>
      <p>% Positive: {porcentajeGood}</p>
    </div>
  )
}

export default App


