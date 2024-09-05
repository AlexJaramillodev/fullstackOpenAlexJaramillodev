import "./App.css";
import { useState } from "react";

const App = () => {
  const anecdotes = [
    "El código es una conversación entre el programador y la máquina.",
    "Piensa en algoritmos, no en código.",
    "La depuración es el doble de difícil que escribir el código en primer lugar.",
    "La optimización prematura es la raíz de todos los males.",
    "El código es como el humor. Cuando tienes que explicarlo, es malo.",
    "Primero, resuelve el problema. Luego, escribe el código.",
    "En programación, la parte difícil no es resolver problemas, sino decidir qué problemas resolver.",
    "El código nunca miente, los comentarios a veces sí.",
    "Los programas deben ser escritos para que las personas los lean, y solo incidentalmente para que las máquinas los ejecuten.",
    "La simplicidad es el alma de la eficiencia.",
  ];

  

  const [selected, setSelected] = useState(0);
  const [votos, setVotos] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  const HandleClick = () => {
    const random = Math.round(Math.random() * 9);
    console.log(random);
    setSelected(random);
  };

  const HandleVotes = () => {
    const copy = [...votos];
    copy[selected] += 1;
    setVotos(copy);
    console.log(copy);
    
  };

    const maximo = Math.max(...votos)
    console.log(maximo)

    const indiceMax = votos.indexOf(maximo)
    console.log(indiceMax)


  return (
    <div>
      <h2>FRASE DEL DIA</h2>
      <p>{anecdotes[selected]}</p>
      <p>tiene: {votos[selected]} votos</p>
      <button onClick={HandleClick}>Siguiente frase </button>
      <button onClick={HandleVotes}>Votar </button>

      <h2>FRASE CON MAS VOTOS</h2>
      <p>{anecdotes[indiceMax]}</p>
      <p>tiene: {maximo} votos </p>
    </div>
  );
};

export default App;