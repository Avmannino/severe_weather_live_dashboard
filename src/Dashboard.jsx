import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          const displayName = geocodeResponse.data[0].display_name;
          setLocation(extractCityState(displayName));
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
          const displayName = geocodeResponse.data[0].display_name;
          setLocation(extractCityState(displayName));
        } else {
          console.error('Invalid city name');
          return;
        }
      }

      // Fetch gridpoints
      const gridResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
      const { gridId, gridX, gridY, observationStations } = gridResponse.data.properties;

      // Fetch the latest observation station
      const stationsResponse = await axios.get(observationStations);
      const observationStation = stationsResponse.data.features[0].properties.stationIdentifier;

      // Fetch current weather
      const weatherResponse = await axios.get(`https://api.weather.gov/stations/${observationStation}/observations/latest`);
      const observation = weatherResponse.data.properties;

      console.log('Observation Data:', observation); // Log the observation data

      // Fetch hourly forecast for humidity and dew point
      const hourlyForecastResponse = await axios.get(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast/hourly`);
      const hourlyForecast = hourlyForecastResponse.data.properties.periods[0];

      console.log('Hourly Forecast Data:', hourlyForecast); // Log the hourly forecast data

      const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

      const currentWeather = {
        temperature: observation.temperature?.value ? celsiusToFahrenheit(observation.temperature.value) : null,
        windSpeed: observation.windSpeed?.value,
        humidity: hourlyForecast.relativeHumidity?.value,
        pressure: observation.barometricPressure?.value / 100, // Convert to hPa
        dewPoint: hourlyForecast.dewpoint?.value ? celsiusToFahrenheit(hourlyForecast.dewpoint.value) : null,
        shortForecast: observation.textDescription,
      };

      console.log('Current Weather Data:', currentWeather); // Log the current weather data

      setWeather(currentWeather);

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

  const extractCityState = (displayName) => {
    const parts = displayName.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      return `${parts[0]}, ${parts[2]}`;
    }
    return displayName;
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
          <p>{location}</p>
          <p>Current Time: {currentTime.toLocaleTimeString()}</p>
          <div className="current-weather-details">
            <p>Temperature: {weather.temperature}°F</p>
            <p>Wind: {weather.windSpeed} mph</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Pressure: {weather.pressure} hPa</p>
            <p>Dew Point: {weather.dewPoint}°F</p>
            <p>{weather.shortForecast}</p>
          </div>
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
