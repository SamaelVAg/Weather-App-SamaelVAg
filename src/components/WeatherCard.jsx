import React, { useEffect, useState } from 'react'
import axios from 'axios'
import loaderImg from '../assets/weatherIcon.png'
import cityList from '../assets/cityList.json'

const WeatherCard = () => {

    const [ loading, setLoading ] = useState( false )
    const [ weather, setWeather ] = useState( {} )
    const [ snow, setSnow ] = useState( false )
    const [ volume, setVolume ] = useState( 0 )
    const [ lat, setLat ] = useState( '' )
    const [ lon, setLon ] = useState( '' )
    const [ metUnis, setMetUnits ] = useState( true )
    const [ inpMsg, setInpMsg ] = useState( '' )

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }

    const success = (pos) => {
        setLat(pos.coords.latitude)
        setLon(pos.coords.longitude)
    }

    const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    const loader = () => {
        if(!lat){
            setLoading( true )
            setTimeout ( () => {
                setLoading( false )
            }, 3000 )
        }
    }

    const request = () => {
        if(!lat){
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=84a53cc64413cd870912f6a51e9f8a75&units=${metUnis ? 'metric' : 'imperial'}`

        axios.get( url )
        .then( res  => setWeather( res.data ))
        .then( rainSnow )
    }

    const changeUnits = () => {
        setMetUnits(!metUnis)
    }

    const citySearch = () => {
        const search = inpMsg.split(',')
        const city = search[0].trim()
        const country = search[1].trim()
        const index = cityList.findIndex( item => item.name === city & item.country === country )
        setLat(cityList[index].coord.lat)
        setLon(cityList[index].coord.lon)      
    }

    useEffect( () => {
        loader()
        request()
    }, [lat, lon, metUnis] )

    const rainSnow = () => {
        if(weather.snow){
            setSnow( true )
            setVolume( weather.snow?.['1h'] )
        }else if(weather.rain){
            setVolume( weather.rain?.['1h'])
        }
    }

    const convertSpeed = (speed) =>{
        return Math.round(3.6 * speed)
    }

    const changeCity = (event) => {
        setInpMsg(event.target.value)
    }

    return (
        <div className='main-page'>

            <div className='loader' style={{display : loading ? 'block' : 'none'}}>
                <img src={loaderImg} alt="" />
            </div>

            <div className="grid-wrapper">
                <header className='generic-card icon'>
                    <input type="text" className='icon-input' placeholder='Search City, Ie: Mexico City, MX' onChange={changeCity} value={inpMsg}/>
                    <div className='icon-buttons'>
                        <button className='icon-search' onClick={citySearch}>
                            <i class='bx bx-search bx-sm' ></i>
                        </button>
                        <button className='icon-units' onClick={changeUnits}>
                        {metUnis ? '°F' : '°C' }
                        </button>
                    </div>
                </header>

                <main className='weather-main'>
                    <article className='weather-condition'>
                        <img className='weather-icon' src={`http://openweathermap.org/img/w/${weather.weather?.[0].icon}.png`} alt="" />
                        <span className='weather-description'>
                            {`${weather.weather?.[0].description[0].toUpperCase()}${weather.weather?.[0].description.substring(1)}`}
                        </span>
                    </article>
                    <h2 className='weather-current'>
                        {Math.round( weather.main?.temp )}<span>{metUnis ? '°C' : '°F' }</span></h2>
                    <article className='weather-feels'>
                        Feels like <br />
                        <span className='feels-temp'>
                            {Math.round( weather.main?.feels_like )}°
                        </span> 
                    </article>
                    <table className='weather-intervals'>
                        <tr className='intervals-header'>
                            <th>MIN</th>
                            <th>MAX</th>
                        </tr>
                        <tr className='intervals-temp'>
                            <td>{Math.round( weather.main?.temp_min )}°</td>
                            <td>{Math.round( weather.main?.temp_max )}°</td>
                        </tr>
                    </table>
                </main>

                <section className="generic-card city">
                    <h3 className='card-title'>
                        Location
                    </h3>
                    <article className='city-city'>
                        {weather.name}
                    </article>
                    <article className='city-country'>
                        {weather.sys?.country}
                    </article>
                </section>

                <section className='generic-card rain'>
                    <h3 className='card-title rain'>
                        {snow ? 'Snow' : 'Rain'}
                    </h3>
                    <span className='rain-volume'>
                        {volume}
                    </span>
                    <span>
                        mm
                    </span>
                </section>

                <section className='generic-card atmos'>
                    <h3 className='card-title atmos'>
                        Atmospheric
                    </h3>
                    <article className="atmos-item">
                        <span className='atmos-label'>
                            Humidity
                        </span>
                        <span className='atmos-value'>
                            {weather.main?.humidity}
                        </span>
                        <span className='atmos-label'>
                            %
                        </span>
                    </article>
                    <article className="atmos-item">
                        <span className='atmos-label'>
                            Presure
                        </span>
                        <span className='atmos-value'>
                        {weather.main?.pressure}
                        </span>
                        <span className='atmos-label'>
                            hPa
                        </span>
                    </article>
                </section>

                <section className="generic-card wind">
                    <h3 className='card-title wind'>
                        Wind
                    </h3>
                    <article className='wind-arrow'  style={{transform:`rotate(${weather.wind?.deg}deg)`}}>
                    </article>
                    <span className='wind-speed'>
                        {metUnis ? convertSpeed(weather.wind?.speed) : Math.round(weather.wind?.speed)} {metUnis ? 'Km/h' : 'mph' }
                    </span>
                </section>
            </div>
        </div>
    );
};

export default WeatherCard;

