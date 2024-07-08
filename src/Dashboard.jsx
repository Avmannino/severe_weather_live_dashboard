import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const locationImage = "./icons/location_marker.png";
const dateTimeImage = "./icons/calendar_small.png";

const weatherIcons = {
  0: 'sunny.png',           // Clear sky - Y
  1: 'mostlysunny.png',     // Mainly clear - Y
  2: 'partly_cloudy.png',   // Partly cloudy - Y
  3: 'cloudy.png',          // Overcast - Y
  45: 'fog.png',            // Fog - Y
  48: 'depositing_rime_fog.png', // Depositing rime fog
  51: 'drizzle_light.png',  // Drizzle: Light
  53: 'drizzle_moderate.png', // Drizzle: Moderate
  55: 'drizzle_dense.png',  // Drizzle: Dense
  56: 'freezing_drizzle_light.png', // Freezing Drizzle: Light
  57: 'freezing_drizzle_dense.png', // Freezing Drizzle: Dense
  61: 'rain_slight.png',    // Rain: Slight
  63: 'rain_moderate.png',  // Rain: Moderate
  65: 'rain_heavy.png',     // Rain: Heavy
  66: 'freezing_rain_light.png', // Freezing Rain: Light
  67: 'freezing_rain_heavy.png', // Freezing Rain: Heavy
  71: 'snow_fall_slight.png', // Snow fall: Slight
  73: 'snow.png',           // Snow fall: Moderate - Y
  75: 'snow_fall_heavy.png', // Snow fall: Heavy
  77: 'snow_grains.png',    // Snow grains
  80: 'rain_showers_slight.png', // Rain showers: Slight
  81: 'rain_showers_moderate.png', // Rain showers: Moderate
  82: 'rain_showers_violent.png', // Rain showers: Violent
  85: 'snow_showers_slight.png', // Snow showers: Slight
  86: 'snow_showers_heavy.png',  // Snow showers: Heavy
  95: 'thunderstorm.png',   // Thunderstorm: Slight or moderate
  96: 'thunderstorm_hail.png', // Thunderstorm with slight hail
  99: 'thunderstorm_heavy_hail.png' // Thunderstorm with heavy hail
};

const weatherDescriptions = {
  0: 'Clear',
  1: 'Mostly Sunny',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle: Light',
  53: 'Drizzle: Moderate',
  55: 'Drizzle: Dense',
  56: 'Freezing Drizzle: Light',
  57: 'Freezing Drizzle: Dense',
  61: 'Rain: Slight',
  63: 'Rain: Moderate',
  65: 'Rain: Heavy',
  66: 'Freezing Rain: Light',
  67: 'Freezing Rain: Heavy',
  71: 'Snow fall: Slight',
  73: 'Snow fall: Moderate',
  75: 'Snow fall: Heavy',
  77: 'Snow Grains',
  80: 'Rain Showers: Slight',
  81: 'Rain Showers: Moderate',
  82: 'Rain Showers: Violent',
  85: 'Snow Showers: Slight',
  86: 'Snow Showers: Heavy',
  95: 'Thunderstorms',
  96: 'Thunderstorm w/ slight hail',
  99: 'Thunderstorm w/ heavy hail'
};

const getWeatherIcon = (weatherCode) => {
  return weatherIcons[weatherCode] || 'default.png';
};

const getWeatherDescription = (weatherCode) => {
  return weatherDescriptions[weatherCode] || 'Unknown weather';
};

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [isCelsius, setIsCelsius] = useState(false);

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

      // Fetch weather data from Open-Meteo API
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,weathercode&timezone=auto`);
      console.log(weatherResponse.data); // Debug: Log the full API response

      const weatherData = weatherResponse.data.current_weather;

      const currentWeather = {
        temperatureCelsius: Math.round(weatherData.temperature),
        temperatureFahrenheit: Math.round((weatherData.temperature * 9/5) + 32),
        windSpeed: weatherData.windspeed,
        windDirection: weatherData.winddirection,
        weatherCode: weatherData.weathercode,
        weatherDescription: getWeatherDescription(weatherData.weathercode),
        iconUrl: `/icons/${getWeatherIcon(weatherData.weathercode)}`
      };

      setWeather(currentWeather);

      const forecastData = weatherResponse.data.daily;
      const formattedForecast = forecastData.time.map((time, index) => ({
        date: new Date(time),
        temperatureMaxCelsius: Math.round(forecastData.temperature_2m_max[index]),
        temperatureMinCelsius: Math.round(forecastData.temperature_2m_min[index]),
        temperatureMaxFahrenheit: Math.round((forecastData.temperature_2m_max[index] * 9/5) + 32),
        temperatureMinFahrenheit: Math.round((forecastData.temperature_2m_min[index] * 9/5) + 32),
        precipitationSum: forecastData.precipitation_sum[index],
        weatherCode: forecastData.weathercode ? forecastData.weathercode[index] : null,
        weatherDescription: forecastData.weathercode ? getWeatherDescription(forecastData.weathercode[index]) : 'N/A'
      }));

      setForecast(formattedForecast);

      const hourlyData = weatherResponse.data.hourly;
      const formattedHourlyForecast = hourlyData.time.slice(0, 48).map((time, index) => ({
        time: new Date(time),
        temperatureCelsius: Math.round(hourlyData.temperature_2m[index]),
        temperatureFahrenheit: Math.round((hourlyData.temperature_2m[index] * 9/5) + 32),
        weatherCode: hourlyData.weathercode[index],
        weatherDescription: getWeatherDescription(hourlyData.weathercode[index])
      }));

      console.log(formattedHourlyForecast); // Debug: Log the formatted hourly forecast

      setHourlyForecast(formattedHourlyForecast);
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

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard</h1>
      </header>

      <div className="search-bar-container">
        <label className="switch">
          <input type="checkbox" checked={isCelsius} onChange={toggleTemperatureUnit} />
          <span className="slider"></span>
        </label>
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
      </div>

      {weather && (
        <>
        <div className="section current-weather" style={{ textAlign: 'left' }}>
          <img src={weather.iconUrl} alt={weather.weatherDescription} style={{ width: '150px', height: '150px', margin: '10px 0' }} />
          <p style={{ fontSize: '58px', fontWeight: 'normal', color: 'white', margin: '-20px 0 0px 10px' }}>
            {isCelsius ? weather.temperatureCelsius : weather.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '-20px 0 15px -5px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'normal', color: 'white', margin: '10px 0 0 25px' }}>{weather.weatherDescription}</p>
          </div>

          <div className="styled-line-break"></div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0px 0 5px -5px' }}>
            <img src={locationImage} alt="Location" style={{ width: '25px', height: '25px', margin:'0 5px' }} />
            <p style={{ fontSize: '16px', margin: '25px 0' }}>{location}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 10px 0' }}>
            <img src={dateTimeImage} alt="Date and Time" style={{ width: '25px', height: '25px', margin: '0px 5px 5px 1px' }} />
            <p style={{ fontSize: '14px', margin: '0px 0' }}>{currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}</p>
          </div>
          
        </div>
        <div className="current-weather-details" style={{ textAlign: 'left', margin: '20px auto', maxWidth: '300px' }}>
          <p>Wind: {weather.windSpeed} mph</p>
          <p>Wind Direction: {weather.windDirection}°</p>
        </div>
        </>
      )}

      {forecast && (
        <div className="section forecast">
          <h2>7-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-header">
                  <span className="forecast-day">{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  <span className="forecast-temp">
                    Max: {isCelsius ? day.temperatureMaxCelsius : day.temperatureMaxFahrenheit}°{isCelsius ? 'C' : 'F'} / Min: {isCelsius ? day.temperatureMinCelsius : day.temperatureMinFahrenheit}°{isCelsius ? 'C' : 'F'}
                  </span>
                </div>
                <div className="forecast-details">
                  <span>{day.weatherDescription}</span>
                  <span>Precipitation: {day.precipitationSum} mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hourlyForecast && (
        <div className="section hourly-forecast">
          <h2>48-Hour Forecast</h2>
          <div className="hourly-forecast-grid">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="hourly-forecast-item">
                <div className="hourly-forecast-time">
                  {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="hourly-forecast-temp">
                  High: {isCelsius ? hour.temperatureCelsius : hour.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
                  <br />
                  Low: {isCelsius ? hour.temperatureCelsius : hour.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
                </div>
                <div className="hourly-forecast-icon">
                  <img src={`/icons/${getWeatherIcon(hour.weatherCode)}`} alt={hour.weatherDescription} style={{ width: '50px', height: '50px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="section weather-map">
        <h2>Weather Map</h2>
        <p>Map placeholder</p>
      </div> */}
    </div>
  );
}

export default Dashboard;
