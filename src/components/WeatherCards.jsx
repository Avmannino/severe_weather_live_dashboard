import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';
import Compass from './Compass.jsx';
import './WeatherCards.css';

const WeatherCards = ({ lat, lon, setHumidity }) => {
  const [uvIndex, setUvIndex] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [windDirection, setWindDirection] = useState(null);
  const [dewPoint, setDewPoint] = useState(null);
  const [historicalTemp, setHistoricalTemp] = useState(null);
  const [humidity, setLocalHumidity] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat && lon) {
        try {
          // Fetch UV Index data
          const uvResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto`);
          const uvIndexData = uvResponse.data.daily.uv_index_max[0];
          console.log('UV Index Data:', uvIndexData); // Log to debug

          // Fetch 15-minute weather data including dew point
          const dewPointResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=dewpoint_2m&timezone=auto`);
          const dewPointDataCelsius = dewPointResponse.data.hourly.dewpoint_2m[0]; // Get the latest dew point data in Celsius
          const dewPointDataFahrenheit = (dewPointDataCelsius * 9 / 5) + 32; // Convert to Fahrenheit
          console.log('Dew Point Data (F):', dewPointDataFahrenheit); // Log to debug

          // Fetch current weather data
          const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const weatherData = weatherResponse.data.current_weather;
          console.log('Weather Data:', weatherData); // Log to debug

          const windSpeedMph = (weatherData.windspeed * 0.621371).toFixed(1);
          setWindSpeed(windSpeedMph);
          setWindDirection(weatherData.winddirection);
          setDewPoint(dewPointDataFahrenheit); // Set the dew point in Fahrenheit

          // Fetch current humidity data from NWS API
          const nwsResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
          const gridpointUrl = nwsResponse.data.properties.forecastHourly;
          const humidityResponse = await axios.get(gridpointUrl);
          const humidityData = humidityResponse.data.properties.periods[0].relativeHumidity.value;
          console.log('Humidity Data:', humidityData); // Log to debug
          setLocalHumidity(humidityData); // Set the current humidity
          setHumidity(humidityData); // Set the current humidity

          // Set UV index directly without checking for day or night
          setUvIndex(uvIndexData);
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

          const historicalTempDataCelsius = historicalResponse.data.hourly.temperature_2m[0]; // Get the temperature for the same time last year
          const historicalTempDataFahrenheit = (historicalTempDataCelsius * 9 / 5) + 32; // Convert to Fahrenheit
          console.log('Historical Temp Data (F):', historicalTempDataFahrenheit); // Log to debug

          setHistoricalTemp(historicalTempDataFahrenheit);
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

  if (!lat || !lon) {
    return null;
  }

  return (
    <div className="weather-cards-container">
      <div className="weather-card">
        {uvIndex !== null ? (
          <div className="uv-index">
            <h3>UV Index</h3>
            <p>{uvIndex}</p>
            <GaugeChart id="uv-gauge"
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
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="weather-card">
        {windSpeed !== null && windDirection !== null ? (
          <div className="wind-speed">
            <h3>Wind</h3>
            <p>{windSpeed} MPH</p>
            <p className='wind-direction'>{getWindDirection(windDirection)}</p>
            <Compass direction={windDirection} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="weather-card">
        {dewPoint !== null ? (
          <div className="dew-point">
            <h3>Dew Point</h3>
            <p>{dewPoint.toFixed(1)}°F</p>
            <img src="./icons/dew_icon.png" alt="dew-icon" />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="weather-card">
        {humidity !== null ? (
          <div className="humidity">
            <h3>Humidity</h3>
            <p>{humidity}%</p>
            <img src="./icons/humidity_icon.png" alt="humidity-icon" />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="weather-card">
          {index === 3 && historicalTemp !== null ? (
            <div className="historical-temp">
              <h3>Historical Temperature</h3>
              <p>{historicalTemp.toFixed(1)}°F</p>
              <img src="./icons/temp_icon.png" alt="temp-icon" />
            </div>
          ) : (
            index === 3 ? <p>Loading...</p> : null
          )}
        </div>
      ))}
    </div>
  );
}

export default WeatherCards;
