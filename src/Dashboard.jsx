import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const weatherImages = {
  "Sunny": "./sunny.png",
  "Partly Cloudy": "./partlycloudy.png",
  "Cloudy": "./cloudy.png",
  "Mostly Cloudy": "./cloudy.png",
  "Rain": "./rain.png",
  "Snow": "./snow.png",
  "Scattered Showers And Thunderstorms": "./scatteredtstorms.png",
  "Chance Showers And Thunderstorms": "./scatteredtstorms.png",
  "Clear": "./clear.png",
  "Mostly Clear": "./partlycloudy.png",
  "Fog": "./fog.png",
  "Patchy Fog": "./fog.png",
};

const smallWeatherImages = {
  "Clear": "./clearnight_small.png",
  "Mostly Clear": "./clearnight_small.png",
  "Rain": "./rain_small.png",
  "Cloudy": "./cloudy_small.png",
  "Mostly Cloudy": "./cloudy_small.png",
};

const locationImage = "./location_marker.png"; // Add your location image path here
const dateTimeImage = "./calendar_small.png"; // Add your date and time image path here

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
    let city = '', state = '';

    // Iterate through parts to find city and state
    parts.forEach(part => {
      if (part.match(/^[A-Za-z\s]+$/) && !part.match(/county/i)) {
        if (!city) {
          city = part;
        } else if (!state) {
          state = part;
        }
      }
    });

    return city && state ? `${city}, ${state}` : displayName;
  };

  const getWeatherImage = (weatherDescription) => {
    return weatherImages[weatherDescription] || 'path/to/default.png'; // Fallback to a default image
  };

  const getSmallWeatherImage = (weatherDescription) => {
    return smallWeatherImages[weatherDescription] || 'path/to/default.png'; // Fallback to a default image
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard</h1>
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
        <div className="section current-weather" style={{ textAlign: 'left' }}>
          <img src={getWeatherImage(weather.weather)} alt={weather.weather} style={{ width: '125px', height: '125px', margin: '-10px 0' }} />
          <p style={{ fontSize: '58px', fontWeight: 'normal', color: 'white', margin: '0px 0 15px 5px' }}>{weather.temperature}°F</p>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '-20px 0 15px -5px' }}>
            <img src={getSmallWeatherImage(weather.weather)} alt={weather.weather} style={{ width: '30px', height: '30px', marginRight: '5px' }} />
            <p style={{ fontSize: '18px', fontWeight: 'normal', color: 'white', margin: '0' }}>{weather.weather}</p>
          </div>

          <div className="styled-line-break">
          
          </div>


          <div style={{ display: 'flex', alignItems: 'center', margin: '-10px 0 5px -5px' }}>
            <img src={locationImage} alt="Location" style={{ width: '25px', height: '25px', margin:'0 5px' }} />
            <p style={{ fontSize: '14px', margin: '0' }}>{location}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 10px 0' }}>
            <img src={dateTimeImage} alt="Date and Time" style={{ width: '20px', height: '20px', margin: '0px 5px 5px 1px' }} />
            <p style={{ fontSize: '14px', margin: '-15px 0' }}>{currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}</p>
          </div>
          
          <div className="current-weather-details" style={{ textAlign: 'left', margin: '20px auto', maxWidth: '300px' }}>
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
