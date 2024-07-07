// src/components/Dashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const API_KEY = 'your_openweathermap_api_key';

const Dashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleSearch = async () => {
    if (!city) return;

    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
      );
      setWeather(weatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=7&appid=${API_KEY}&units=imperial`
      );
      setForecast(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching weather data', error);
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
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          placeholder="Enter city name" 
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {weather && (
        <div className="section current-weather">
          <h2>Current Weather in {weather.name}</h2>
          <p>Temperature: {weather.main.temp}°F</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} mph</p>
        </div>
      )}

      {forecast && (
        <div className="section forecast">
          <h2>7-Day Forecast</h2>
          <ul>
            {forecast.list.map((day, index) => (
              <li key={index}>
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}: {day.weather[0].description}, {day.temp.day}°F
              </li>
            ))}
          </ul>
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
