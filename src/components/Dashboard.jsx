import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const locationImage = "./icons/location_marker.png";
const dateTimeImage = "./icons/calendar_small.png";

const weatherIcons = {
  0: 'sunny.png',
  1: 'mostlysunny.png',
  2: 'partly_cloudy.png',
  3: 'cloudy.png',
  45: 'fog.png',
  48: 'depositing_rime_fog.png',
  51: 'drizzle.png',
  53: 'drizzle.png',
  55: 'drizzle.png',
  56: 'freezing_drizzle_light.png',
  57: 'freezing_drizzle_dense.png',
  61: 'rain_slight.png',
  63: 'rain_moderate.png',
  65: 'rain_heavy.png',
  66: 'freezing_rain_light.png',
  67: 'freezing_rain_heavy.png',
  71: 'snow_fall_slight.png',
  73: 'snow.png',
  75: 'snow_fall_heavy.png',
  77: 'snow_grains.png',
  80: 'rain_showers_slight.png',
  81: 'rain_showers_moderate.png',
  82: 'rain_showers_violent.png',
  85: 'snow_showers_slight.png',
  86: 'snow_showers_heavy.png',
  95: 'thunderstorms.png',
  96: 'thunderstorms.png',
  99: 'thunderstorms.png',
};

const weatherDescriptions = {
  0: 'Clear',
  1: 'Mostly Sunny',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
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
  95: 'T-Storms',
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
  const [selectedDay, setSelectedDay] = useState(null);

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
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=auto`);
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
        weatherCode: forecastData.weathercode[index],
        weatherDescription: getWeatherDescription(forecastData.weathercode[index])
      }));

      setForecast(formattedForecast);

      const hourlyData = weatherResponse.data.hourly;
      const formattedHourlyForecast = hourlyData.time.map((time, index) => ({
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

  const handleDayClick = (index) => {
    setSelectedDay(selectedDay === index ? null : index);
  };

  const getHourlyForecastForDay = (day) => {
    const startOfDay = new Date(day.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(day.date);
    endOfDay.setHours(23, 59, 59, 999);

    return hourlyForecast.filter((hour) => {
      const hourDate = new Date(hour.time);
      return hourDate >= startOfDay && hourDate <= endOfDay;
    });
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Dashboard</h1>
      </header>
      

      <div className="search-bar-container">
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

      <label className="switch" style={{position:'relative', top:'-4.2vh', left: '-11.5vw', zIndex:'999'}}>
          <input type="checkbox" checked={isCelsius} onChange={toggleTemperatureUnit} />
          <span className="slider">
            <span className="slider-text">
              {isCelsius ? '°C' : '°F'}
            </span>
          </span>
      </label>

      {weather && (
        <>
          <div className="section current-weather">
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
        </>
      )}

      {forecast && (
        <div className="section forecast">
          <h2 style={{position:'absolute', top: "13vh", right:'16vw', fontSize:'30px'}}>7 Day Outlook</h2>
          <h4 style={{position:'absolute', top: "18vh", right:'16vw', fontSize:'15px'}}>* Click for hourly forecast *</h4>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item" onClick={() => handleDayClick(index)}>
                <div className="forecast-header">
                  <span className="forecast-day">{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  <span className="forecast-date">{day.date.toLocaleDateString()}</span>
                  <div className="forecast-temp" style={{alignItems:'start', justifyContent:'end'}}>
                    <span style={{color: 'orange'}}>Hi: {isCelsius ? day.temperatureMaxCelsius : day.temperatureMaxFahrenheit}°{isCelsius ? 'C' : 'F'}</span>
                    <span style={{color: '#448dab'}}>Lo: {isCelsius ? day.temperatureMinCelsius : day.temperatureMinFahrenheit}°{isCelsius ? 'C' : 'F'}</span>
                  </div>
                </div>
                <div className="forecast-details">
                  <img src={`/icons/${getWeatherIcon(day.weatherCode)}`} alt={day.weatherDescription} style={{ width: '60px', height: '60px', display:'flex', margin:'-50px 0 0 0'  }} />
                  <span>{day.weatherDescription}</span>
                </div>
                {selectedDay === index && (
                  <div className="hourly-forecast-grid">
                    {getHourlyForecastForDay(day).map((hour, hourIndex) => (
                      <div key={hourIndex} className="hourly-forecast-item">
                        <div className="hourly-forecast-time">
                          {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="hourly-forecast-temp">
                          {isCelsius ? hour.temperatureCelsius : hour.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
                        </div>
                        <div className="hourly-forecast-description">
                          {hour.weatherDescription}
                        </div>
                        <div className="hourly-forecast-icon">
                          <img src={`/icons/${getWeatherIcon(hour.weatherCode)}`} alt={hour.weatherDescription} style={{ width: '60px', height: '60px'}} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
