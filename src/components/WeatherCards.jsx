import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GaugeChart from 'react-gauge-chart';
import Compass from './Compass.jsx';
import 'animate.css';
import './WeatherCards.css';

const WeatherCards = ({ lat, lon, setHumidity }) => {
  const [uvIndex, setUvIndex] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [windDirection, setWindDirection] = useState(null);
  const [dewPoint, setDewPoint] = useState(null);
  const [historicalTemp, setHistoricalTemp] = useState(null);
  const [humidity, setLocalHumidity] = useState(null);
  const [visibility, setVisibility] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [pressure, setPressure] = useState(null);
  const [cardsOrder, setCardsOrder] = useState([
    'uvIndex',
    'visibility',
    'windSpeed',
    'dewPoint',
    'humidity',
    'historicalTemp',
    'sunriseSunset',
    'pressure'
  ]);
  const [animate, setAnimate] = useState(true);

  const fetchWeatherData = useCallback(async () => {
    if (lat && lon) {
      try {
        const [uvResponse, dewPointResponse, weatherResponse, visibilityResponse, nwsResponse, pressureResponse, sunResponse] = await Promise.all([
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              daily: 'uv_index_max',
              timezone: 'auto'
            }
          }),
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              hourly: 'dewpoint_2m',
              timezone: 'auto'
            }
          }),
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              current_weather: true,
              timezone: 'auto'
            }
          }),
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              hourly: 'visibility',
              timezone: 'auto'
            }
          }),
          axios.get(`https://api.weather.gov/points/${lat},${lon}`),
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              hourly: 'pressure_msl',
              timezone: 'auto'
            }
          }),
          axios.get(`https://api.open-meteo.com/v1/forecast`, {
            params: {
              latitude: lat,
              longitude: lon,
              daily: 'sunrise,sunset',
              timezone: 'auto'
            }
          })
        ]);

        const uvIndexData = uvResponse.data.daily.uv_index_max[0];
        const dewPointDataCelsius = dewPointResponse.data.hourly.dewpoint_2m[0];
        const dewPointDataFahrenheit = (dewPointDataCelsius * 9 / 5) + 32;
        const weatherData = weatherResponse.data.current_weather;
        const windSpeedMph = (weatherData.windspeed * 0.621371).toFixed(1);
        const visibilityData = visibilityResponse.data.hourly.visibility[0];
        const visibilityMiles = (visibilityData * 0.000621371).toFixed(1); // Convert meters to miles

        const gridpointUrl = nwsResponse.data.properties.forecastHourly;
        const humidityData = await axios.get(gridpointUrl).then(res => res.data.properties.periods[0].relativeHumidity.value);

        const pressureDataHpa = pressureResponse.data.hourly.pressure_msl[0];
        const pressureDataInHg = (pressureDataHpa * 0.02953).toFixed(2); // Convert hPa to inHg

        const sunriseData = sunResponse.data.daily.sunrise[0];
        const sunsetData = sunResponse.data.daily.sunset[0];

        setUvIndex(uvIndexData);
        setDewPoint(dewPointDataFahrenheit);
        setWindSpeed(windSpeedMph);
        setWindDirection(weatherData.winddirection);
        setVisibility(visibilityMiles);
        setLocalHumidity(humidityData);
        setHumidity(humidityData);
        setPressure(pressureDataInHg);
        setSunrise(sunriseData);
        setSunset(sunsetData);

        setTimeout(() => {
          setAnimate(false);
        }, 0);
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    }
  }, [lat, lon, setHumidity]);

  const fetchHistoricalWeatherData = useCallback(async () => {
    if (lat && lon) {
      try {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        const formattedDate = lastYear.toISOString().split('T')[0];

        const historicalResponse = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
          params: {
            latitude: lat,
            longitude: lon,
            start_date: formattedDate,
            end_date: formattedDate,
            hourly: 'temperature_2m'
          }
        });

        const historicalTempDataCelsius = historicalResponse.data.hourly.temperature_2m[0];
        const historicalTempDataFahrenheit = (historicalTempDataCelsius * 9 / 5) + 32;
        setHistoricalTemp(Math.round(historicalTempDataFahrenheit));
      } catch (error) {
        console.error('Error fetching historical weather data', error);
      }
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeatherData();
    fetchHistoricalWeatherData();
  }, [fetchWeatherData, fetchHistoricalWeatherData]);

  const getGaugeValue = (uvIndex) => {
    if (uvIndex <= 1.0) return 0.01;
    if (uvIndex <= 2.9) return 0.19;
    if (uvIndex <= 3.0) return 0.20;
    if (uvIndex <= 4.5) return 0.20;
    if (uvIndex <= 5.9) return 0.30;
    if (uvIndex <= 6.0) return 0.40;
    if (uvIndex <= 7.9) return 0.50;
    if (uvIndex <= 8.0) return 0.70;
    if (uvIndex <= 9.0) return 0.70;
    if (uvIndex <= 10.9) return 0.80;
    if (uvIndex <= 11.0) return .90;
    return 1;
  };

  const getUvLevel = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 8) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  const getWindDirection = (degree) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degree / 22.5);
    return directions[index % 16];
  };

  const timeToMinutes = (time) => {
    const date = new Date(time);
    return date.getHours() * 60 + date.getMinutes();
  };

  const currentMinutes = timeToMinutes(new Date());
  const sunriseMinutes = timeToMinutes(sunrise);
  const sunsetMinutes = timeToMinutes(sunset);
  const sunPosition = ((currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) * 100;

  const lastYearDate = new Date();
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
  const formattedLastYearDate = lastYearDate.toLocaleDateString();

  const moveCard = (dragIndex, hoverIndex) => {
    const newOrder = Array.from(cardsOrder);
    const [removed] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, removed);
    setCardsOrder(newOrder);
  };

  const renderCard = (cardType, index) => {
    const animationClass = animate ? 'animate__animated animate__slideInLeft' : '';
    switch (cardType) {
      case 'uvIndex':
        return (
          uvIndex !== null && (
            <div className={`uv-index ${animationClass}`}>
              <h3>UV Index</h3>
              <p>{uvIndex}</p>
              <GaugeChart
                id="uv-gauge"
                nrOfLevels={11}
                arcsLength={[2 / 11, 2 / 11, 2 / 11, 2 / 11, 2 / 11]}
                colors={['#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#8B0000']}
                percent={getGaugeValue(uvIndex)}
                arcPadding={0.02}
                textColor="#000"
                needleColor="#ccc"
                animate={false}
                hideText={true}
                style={{ width: '175px', height: '175px' }}
              />
              <p style={{ marginTop: '-105px' }}>{getUvLevel(uvIndex)}</p>
            </div>
          )
        );
      case 'visibility':
        return (
          visibility !== null && (
            <div className={`visibility ${animationClass}`}>
              <h3 className='visibility-header'>Visibility</h3>
              <p className='visibility-figure'>{visibility} miles</p>
              <img src="./icons/binoculars.png" alt="visibility-icon" />
            </div>
          )
        );
      case 'windSpeed':
        return (
          windSpeed !== null && windDirection !== null && (
            <div className={`wind-speed ${animationClass}`}>
              <h3>Wind</h3>
              <p>{windSpeed} MPH</p>
              <p className='wind-direction'>{getWindDirection(windDirection)}</p>
              <Compass direction={windDirection} />
            </div>
          )
        );
      case 'dewPoint':
        return (
          dewPoint !== null && (
            <div className={`dew-point ${animationClass}`}>
              <h3>Dew Point</h3>
              <p>{dewPoint.toFixed(1)}°F</p>
              <img src="./icons/dew_icon.png" alt="dew-icon" />
            </div>
          )
        );
      case 'humidity':
        return (
          humidity !== null && (
            <div className={`humidity ${animationClass}`}>
              <h3 className='humidity-header'>Humidity</h3>
              <p className='humidity-figure'>{humidity}%</p>
              <img src="./icons/humidity-icon.png" alt="humidity-icon" />
            </div>
          )
        );
      case 'historicalTemp':
        return (
          historicalTemp !== null && (
            <div className={`historical-temp ${animationClass}`}>
              <h3 className='historical-header'>1 Year Ago:</h3>
              <p className='historical-date'>{formattedLastYearDate}</p>
              <p className='historical-figure'>{historicalTemp}°F</p>
              <img src="./icons/historical-temp.png" alt="historical-icon" />
            </div>
          )
        );
      case 'sunriseSunset':
        return (
          sunrise !== null && sunset !== null && (
            <div className={`sunrise-sunset ${animationClass}`}>
              <h4 style={{fontSize:'16px', marginBottom:'-30px', marginTop:'20px'}}>Sun</h4>
              <svg width="100%" height="100px" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 40 Q 50 -10 100 40" stroke="#ffa500" strokeWidth="2.5" fill="none" />
                <circle cx={sunPosition} cy="13" r="3" fill="white" />
                <text x="0" y="50" fontSize="8" fill='white'>{new Date(sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</text>
                <text x="62" y="50" fontSize="8" fill='white'>{new Date(sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</text>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src="./icons/sunrise.png" alt="Sunrise" style={{ width: '35px', height: '35px', marginLeft:'-30px', marginTop: '-10px' }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <img src="./icons/sunset.png" alt="Sunset" style={{ width: '40px', height: '40px', marginRight:'-30px', marginTop: '-10px' }} />
                </div>
              </div>
            </div>
          )
        );
      case 'pressure':
        return (
          pressure !== null && (
            <div className={`pressure ${animationClass}`}>
              <h3>Pressure</h3>
              <p>{pressure} inHg</p>
              <img src="./icons/pressure.png" alt="Pressure Icon" style={{ width: '35px', height: '35px', marginTop: '5px' }} />
            </div>
          )
        );
          
      default:
        return null;
    }
  };

  const DraggableCard = ({ id, index, children }) => {
    const [, ref] = useDrag({
      type: 'card',
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: 'card',
      hover: (item) => {
        if (item.index !== index) {
          moveCard(item.index, index);
          item.index = index;
        }
      },
    });

    return (
      <div ref={(node) => ref(drop(node))} className={`draggable-card ${animate ? 'animate__animated animate__fadeInUp' : ''}`}>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="weather-cards-container">
        {cardsOrder.map((cardType, index) => (
          <DraggableCard key={cardType} id={cardType} index={index}>
            {renderCard(cardType, index)}
          </DraggableCard>
        ))}
      </div>
    </DndProvider>
  );
};

export default WeatherCards;
