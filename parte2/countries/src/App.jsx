
import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Infocountry from './components/Infocountry';

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [country, setCountry] = useState(null);
  const [searchCountry, setSearchCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [clima, setClima] = useState({});

  
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); 

  const handleChange = (event) => {
    setSearchCountry(event.target.value);
  };

  const handleClick = (selectedCountry) => {
    setCountry(selectedCountry);
    setSearchCountry(""); 

    const lat = selectedCountry.capitalInfo.latlng[0];
    const lon = selectedCountry.capitalInfo.latlng[1];

    axios
      .get(
        `https://my.meteoblue.com/packages/current?apikey=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
      )
      .then((response) => {
        setClima(response.data);
        //console.log("promesa completada", response.data);
      })
      .catch((error) => {
        console.log("fail", clima);
      });
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchCountry.toLowerCase())
  );

  return (
    <div>
      <h1>APLICACION INFOPAISES</h1>
      Country:{" "}
      <input
        type="text"
        onChange={handleChange}
        value={searchCountry}
        placeholder="nombre del pais"
      />
      <hr />
      <div>
        {filteredCountries.length < 10 ? (
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.cca3}>
                {country.name.common}
                <button onClick={() => handleClick(country)}>ver</button>
              </li>
            ))}
          </ul>
        ) : (
          searchCountry && <p>Demasiadas coincidencias.</p>
        )}
      </div>
      <hr />
      {country && <Infocountry country={country} clima={clima} />}
    </div>
  );
};

export default App;
