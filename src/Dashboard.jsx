// src/components/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleSearch = async () => {
    if (!searchInput) return;

    try {
      let lat, lon;

      if (/^\d{5}$/.test(searchInput)) {
        // If the input is a 5-digit number, treat it as a ZIP code
        const geocodeResponse = await axios.get(`https://nominatim.openstreetmap.org/search?postalcode=${searchInput}&country=us&format=json&limit=1`);
        if (geocodeResponse.data.length > 0) {
          lat = geocodeResponse.data[0].lat;
          lon = geocodeResponse.data[0].lon;
        } else {
          console.error('Invalid ZIP code');
          return;
        }
      } else {
        // Otherwise, treat it as a city name
        const geocodeResponse = await axios.get(`https://nominatim.openstreetmap.org/search?q=${searchInput}&format=json&limit=1`);
        if (geocodeResponse.data.length > 0) {
          lat = geocodeResponse.data[0].lat;
          lon = geocodeResponse.data[0].lon;
        } else {
          console.error('Invalid city name');
          return;
        }
      }

      // Fetch gridpoints
      const gridResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
      const { gridId, gridX, gridY } = gridResponse.data.properties;

      // Fetch current weather
      const weatherResponse = await axios.get(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`);
      setWeather(weatherResponse.data.properties.periods[0]);

      // Fetch 7-day forecast
      const forecastResponse = await axios.get(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`);
      setForecast(forecastResponse.data.properties.periods);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Weather Dashboard</h1>
        <p>Stay updated with the latest weather information</p>
      </header>

      <div className="search-bar">
        <input 
          type="text" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Enter city name or ZIP code" 
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {weather && (
        <div className="section current-weather">
          <h2>Current Weather</h2>
          <p>Temperature: {weather.temperature}°F</p>
          <p>Wind: {weather.windSpeed}</p>
          <p>{weather.shortForecast}</p>
        </div>
      )}

      {forecast && (
        <div className="section forecast">
          <h2>7-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-header">
                  <span className="forecast-day">{day.name}</span>
                  <span className="forecast-temp">{day.temperature}°F</span>
                </div>
                <div className="forecast-details">
                  <span>{day.shortForecast}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section weather-map">
        <h2>Weather Map</h2>
        <p>Map placeholder</p>
      </div>
    </div>
  );
}

export default Dashboard;
