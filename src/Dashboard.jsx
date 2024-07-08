import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const weatherImages = {
  "Sunny": "./sunny.png",
  "Partly Cloudy": "./partlycloudy.png",
  "Cloudy": "./cloudy.png",
  "Rain": "./rain.png",
  "Snow": "./snow.png",
  "Scattered Showers And Thunderstorms": "./scatteredtstorms.png"
};

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

      const gridResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);
      const { gridId, gridX, gridY, observationStations } = gridResponse.data.properties;

      const stationsResponse = await axios.get(observationStations);
      const observationStation = stationsResponse.data.features[0].properties.stationIdentifier;

      const weatherResponse = await axios.get(`https://api.weather.gov/stations/${observationStation}/observations/latest`);
      const observation = weatherResponse.data.properties;

      console.log('Observation Data:', observation);

      const hourlyForecastResponse = await axios.get(`https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast/hourly`);
      const hourlyForecast = hourlyForecastResponse.data.properties.periods[0];

      console.log('Hourly Forecast Data:', hourlyForecast);

      const celsiusToFahrenheit = (celsius) => Math.round((celsius * 9/5) + 32);

      const currentWeather = {
        temperature: observation.temperature?.value ? celsiusToFahrenheit(observation.temperature.value) : 'N/A',
        dewPoint: hourlyForecast.dewpoint?.value ? celsiusToFahrenheit(hourlyForecast.dewpoint.value) : 'N/A',
        humidity: hourlyForecast.relativeHumidity?.value ?? 'N/A',
        windDirection: observation.windDirection?.value ?? 'N/A',
        windSpeed: observation.windSpeed?.value ?? 'N/A',
        weather: hourlyForecast.shortForecast ?? 'N/A',
        probabilityOfPrecipitation: hourlyForecast.probabilityOfPrecipitation?.value ?? 'N/A',
        pressure: observation.barometricPressure?.value ? (observation.barometricPressure.value / 100).toFixed(2) : 'N/A', // Convert to hPa
        shortForecast: observation.textDescription ?? 'N/A',
        heatIndex: observation.heatIndex?.value ? celsiusToFahrenheit(observation.heatIndex.value) : 'N/A',
      };

      console.log('Current Weather Data:', currentWeather);

      setWeather(currentWeather);

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
      return `${parts[1]}, ${parts[2]}, ${parts[0]}`;
    }
    return displayName;
  };

  const getWeatherImage = (weatherDescription) => {
    return weatherImages[weatherDescription] || 'path/to/default.png'; // Fallback to a default image
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
          <h2 style={{ fontSize: '14px' }}>Current Weather</h2>
          <p style={{ fontSize: '14px', margin: '0' }}>{currentTime.toLocaleTimeString()}</p>
          <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '0' }}>{location}</p>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '15px' }}>
              <p style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', margin: '0 0px' }}>{weather.temperature}°F</p>
              <p style={{ fontSize: '15px', fontWeight: 'light', color: 'white', margin: '0' }}>Feels Like: {weather.heatIndex}°F</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'-20px', marginTop: '-70px' }}>
              <img src={getWeatherImage(weather.weather)} alt={weather.weather} style={{ width: '120px', height: '120px' }} />
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'yellow', margin: '0' }}>{weather.weather}</p>
            </div>
          </div>
          
          <div className="current-weather-details">
            <p>Wind: {weather.windSpeed} mph</p>
            <p>Wind Direction: {weather.windDirection}°</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Pressure: {weather.pressure} hPa</p>
            <p>Dew Point: {weather.dewPoint}°F</p>
            <p>Chance of Rain: {weather.probabilityOfPrecipitation}%</p>
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
