import { useState } from 'react'
import './App.css'



const StaticLine = ({text, value})=> {

  return(
    <div>
      <p>{text} {value}</p>
    </div>
  )
}


const Statics = ({good, neutral, bad, total, promedio, positive, textbueno, textneutral, textbad, texttotal, textpromedio, textpositive}) =>{

  if ( total === 0){

    return (
      <div>
        <p>Aun no tenemos opiniones !!</p>
      </div>
      
    )
  }

  return (
    <div>
      <table>        
                 
        <thead>
          <tr>            
            <th>Estadistica</th>
            <th>Valor</th>
          </tr>
          </thead> 

          <tbody>
          <tr>
              <td>{textbueno}</td>
              <td>{good}</td>
           </tr>
           <tr> 
              <td>{textneutral}</td>
              <td>{neutral}</td>
            </tr>
            <tr>
              <td>{textbad}</td>
              <td>{bad}</td>
            </tr>
            <tr>
              <td>{texttotal}</td>
              <td>{total}</td>
            </tr>
            <tr>
            <td>{textpromedio}</td>
              <td>{promedio}</td>
            </tr>
            <tr>
              <td>{textpositive}</td>
              <td>{positive}</td>
            </tr>
          </tbody> 
      </table>
    </div>
  )
}

const Button = ({handleClick, text}) =>{

  return (
   <button onClick={handleClick}>{text}</button>
  )
}

const App = () => {
  
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
      <Button handleClick={handleGoodClick} text={'Good'}/>
      <Button handleClick={handleNeutralClick} text={'Neutral'}/>
      <Button handleClick={handleBadClick} text={'Bad'}/>

          
      <h2>Statics</h2>

      
     <Statics textbueno='Good: ' good={good} textneutral='Neutral: ' neutral={neutral} textbad='Bad: ' bad={bad} texttotal='Total: ' total={total} textpromedio= 'Promedio: ' promedio={promedio} textpositive='Positive: ' positive={porcentajeGood} />  
    
    <hr />

    <StaticLine text='Good: ' value={good}/>
    <StaticLine text='Neutral: ' value={neutral}/>
    <StaticLine text='Bad: ' value={bad}/>
    <StaticLine text='Total: ' value={total}/>
    <StaticLine text='Promedio: ' value={promedio}/>
    <StaticLine text='Positive: ' value={porcentajeGood}/>

    </div>
  )
}

export default App


