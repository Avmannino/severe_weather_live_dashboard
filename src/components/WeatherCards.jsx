import React, { useState, useEffect } from 'react';
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
  const [cardsOrder, setCardsOrder] = useState([
    'uvIndex',
    'visibility',
    'windSpeed',
    'dewPoint',
    'humidity',
    'historicalTemp'
  ]);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat && lon) {
        try {
          const uvResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto`);
          const uvIndexData = uvResponse.data.daily.uv_index_max[0];

          const dewPointResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=dewpoint_2m&timezone=auto`);
          const dewPointDataCelsius = dewPointResponse.data.hourly.dewpoint_2m[0];
          const dewPointDataFahrenheit = (dewPointDataCelsius * 9 / 5) + 32;

          const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const weatherData = weatherResponse.data.current_weather;

          const windSpeedMph = (weatherData.windspeed * 0.621371).toFixed(1);
          setWindSpeed(windSpeedMph);
          setWindDirection(weatherData.winddirection);
          setDewPoint(dewPointDataFahrenheit);

          const visibilityResponse = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=dccf2094f0544bf0a44723686d7fbb12`);
          const visibilityData = visibilityResponse.data.data[0].vis;
          setVisibility((visibilityData * 0.621371).toFixed(1));

          const nwsResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
          const gridpointUrl = nwsResponse.data.properties.forecastHourly;
          const humidityResponse = await axios.get(gridpointUrl);
          const humidityData = humidityResponse.data.properties.periods[0].relativeHumidity.value;
          setLocalHumidity(humidityData);
          setHumidity(humidityData);

          setUvIndex(uvIndexData);

          // Remove animation after a short delay
          setTimeout(() => {
            setAnimate(false);
          }, 0); // Adjust the delay as needed
        } catch (error) {
          console.error('Error fetching weather data', error);
        }
      }
    };

    const fetchHistoricalWeatherData = async () => {
      if (lat && lon) {
        try {
          const lastYear = new Date();
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          const formattedDate = lastYear.toISOString().split('T')[0];

          const historicalResponse = await axios.get(`https://archive-api.open-meteo.com/v1/archive`, {
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
    };

    fetchWeatherData();
    fetchHistoricalWeatherData();
  }, [lat, lon]);

  const getGaugeValue = (uvIndex) => {
    if (uvIndex <= 1.0) return 0.01;
    if (uvIndex <= 2.9) return 0.10;
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

  const lastYearDate = new Date();
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
  const formattedLastYearDate = lastYearDate.toLocaleDateString();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const newOrder = Array.from(cardsOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setCardsOrder(newOrder);
  };

  const renderCard = (cardType) => {
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
      default:
        return null;
    }
  };

  const DraggableCard = ({ id, index, children }) => {
    const [, ref] = useDrag({
      type: 'card',
      item: { id, index }
    });

    const [, drop] = useDrop({
      accept: 'card',
      hover: (item) => {
        if (item.index !== index) {
          const newOrder = [...cardsOrder];
          newOrder.splice(item.index, 1);
          newOrder.splice(index, 0, item.id);
          item.index = index;
          setCardsOrder(newOrder);
        }
      }
    });

    return (
      <div ref={(node) => ref(drop(node))} className={`draggable-card ${animate ? 'animate__animated animate__slideInLeft' : ''}`}>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="weather-cards-container">
        {cardsOrder.map((cardType, index) => (
          <DraggableCard key={cardType} id={cardType} index={index}>
            {renderCard(cardType)}
          </DraggableCard>
        ))}
      </div>
    </DndProvider>
  );
};

export default WeatherCards;
