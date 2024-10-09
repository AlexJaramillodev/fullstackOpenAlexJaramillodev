const Infocountry = ({country, clima}) => {

    if (!country){

        return null
    }

    const imagenClima = clima.data_current 
        ? `../assets/imagenes/${clima.data_current.pictocode_detailed}_${clima.data_current.isdaylight ? 'day' : 'night'}.png` 
        : null;

    return (
        <div>
            <h1>{country.name.common}</h1>
            <h2>Nombre oficial: {country.name.official}</h2>
            <p>Capital: {country.capital}</p>
            <p>Región: {country.region}</p>
            <p>Area: {country.area.toLocaleString()}</p>
            <p>Población: {country.population.toLocaleString()}</p>
            <ul>Lenguaje: 
                {Object.values(country.languages).map((language, index) => (
                    <li key={index}>
                      {language}
                    </li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150px" />
            <br />
            <img src={country.coatOfArms.png} alt={`coatOfArms of ${country.name.common}`} width="120px" />
            <hr />
            {clima.data_current ? (
                <div>
                <h2>Clima en {country.capital}</h2>
                <p>Hora local: {clima.data_current.time}</p>
                <p>Temperatura: {clima.data_current.temperature}°C</p>
                <img src={imagenClima} alt="imagen clima" width="150px"/>
                <p>Velocidad del viento: {clima.data_current.wind_speed && `${clima.data_current.wind_speed} ms`}
                {!clima.data_current.wind_speed && "'sin datos'"}</p>
                
            </div>
            ) : (
                <p>No se ha podido obtener la informacion del clima</p>
            )}
            
        </div>
    )
}

export default Infocountry;