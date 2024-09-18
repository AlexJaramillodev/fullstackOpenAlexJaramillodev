import { useState } from "react";
import "./App.css";
import Formulario from "./components/Formulario";
import Filtro from "./components/Filtro";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "040-123456", id: 1 },
    { name: "Ada Lovelace", phone: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", phone: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", phone: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newphone, setNewPhone] = useState("");
  const [searchPersons, setSearchPersons] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    console.log(event.target);

    const personExist = persons.some((person) => person.name === newName);

    if (personExist) {
      alert(`el nombre: ${newName} ya se encuentra registrado`);
    } else if (newName === "" || newphone === "") {
      alert("Por favor ingrese un dato");
    } else {
      const personObject = {
        name: newName,
        phone: newphone,
        id: persons.length + 1,
      };
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewPhone("");
    }
  };

  const handlePersonChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    console.log(event.target.value);
    setNewPhone(event.target.value);
  };

  const handleFilterchange = (event) => {
    console.log(event.target.value);
    setSearchPersons(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchPersons.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <Filtro
        handleFilterchange={handleFilterchange}
        searchPersons={searchPersons}
      />
      <h2>Agregar Nuevo</h2>
      <Formulario
        newName={newName}
        newphone={newphone}
        addPerson={addPerson}
        handlePersonChange={handlePersonChange}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
