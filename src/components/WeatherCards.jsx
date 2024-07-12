// src/components/WeatherCards.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GaugeChart from 'react-gauge-chart';
import './WeatherCards.css';

const WeatherCards = ({ lat, lon }) => {
  const [uvIndex, setUvIndex] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat && lon) {
        try {
          const uvResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto`);
          const uvIndexData = uvResponse.data.daily.uv_index_max[0];
          setUvIndex(uvIndexData);

          const windResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const windSpeedData = windResponse.data.current_weather.windspeed;
          const windSpeedMph = (windSpeedData * 0.621371).toFixed(1); 
          setWindSpeed(windSpeedMph);
        } catch (error) {
          console.error('Error fetching weather data', error);
        }
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  const getGaugeValue = (uvIndex) => {
    if (uvIndex <= 1.0) return 0.01; // mapped to 10%
    if (uvIndex <= 2.9) return 0.10; // mapped to 20%
    if (uvIndex <= 3.0) return 0.20; // mapped to 30%
    if (uvIndex <= 4.5) return 0.20; // mapped to 40%
    if (uvIndex <= 5.9) return 0.30; // mapped to 50%
    if (uvIndex <= 6.0) return 0.40; // mapped to 60%
    if (uvIndex <= 7.9) return 0.50; // mapped to 70%
    if (uvIndex <= 8.0) return 0.70; // mapped to 80%
    if (uvIndex <= 9.0) return 0.70; // mapped to 90%
    if (uvIndex <= 10.9) return 0.80; // mapped to 95%
    if (uvIndex <= 11.0) return .90; // mapped to 100%
    return 1; // 11+ mapped to 100%
  };

  const getUvLevel = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 8) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  if (!lat || !lon) {
    return null; // Return nothing if lat and lon are not set
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
        {windSpeed !== null ? (
          <div className="wind-speed">
            <h3>Wind Speed</h3>
            <p>{windSpeed} mph</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="weather-card"></div>
      ))}
    </div>
  );
}

export default WeatherCards;
