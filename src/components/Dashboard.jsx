import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const locationImage = "./icons/location_marker.png";
const dateTimeImage = "./icons/calendar_small.png";
const rainDropImage = "./icons/rain_drop.png";

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
  63: 'rain.png',
  65: 'rain_heavy.png',
  66: 'freezing_rain_light.png',
  67: 'freezing_rain_heavy.png',
  71: 'snow_fall_slight.png',
  73: 'snow.png',
  75: 'snow_fall_heavy.png',
  77: 'snow_grains.png',
  80: 'rain.png',
  81: 'rain.png',
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
  61: 'Rain',
  63: 'Rain: Moderate',
  65: 'Rain: Heavy',
  66: 'Freezing Rain: Light',
  67: 'Freezing Rain: Heavy',
  71: 'Snow fall: Slight',
  73: 'Snow fall: Moderate',
  75: 'Snow fall: Heavy',
  77: 'Snow Grains',
  80: 'Showers',
  81: 'Showers',
  82: 'Showers: Violent',
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

const calculateHeatIndex = (temperatureF, humidity) => {
  const T = temperatureF;
  const R = humidity;
  const HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R - 0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  return Math.round(HI);
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
  const [latLon, setLatLon] = useState({ lat: 50.4, lon: 14.3, zoom: 5 }); // Default coordinates with zoom level

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

      setLatLon({ lat, lon, zoom: 20 }); // Set zoom level to 10 for city-level view

      // Fetch weather data from Open-Meteo API
      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&hourly=temperature_2m,weathercode&timezone=auto`);
      console.log(weatherResponse.data); // Debug: Log the full API response

      const weatherData = weatherResponse.data.current_weather;

      // Assume a fixed humidity value (e.g., 70%) as the API doesn't provide humidity
      const fixedHumidity = 40;
      const temperatureFahrenheit = Math.round((weatherData.temperature * 9 / 5) + 32);
      const heatIndexFahrenheit = calculateHeatIndex(temperatureFahrenheit, fixedHumidity);

      const currentWeather = {
        temperatureCelsius: Math.round(weatherData.temperature),
        temperatureFahrenheit: temperatureFahrenheit,
        humidity: fixedHumidity,
        windSpeed: weatherData.windspeed,
        windDirection: weatherData.winddirection,
        weatherCode: weatherData.weathercode,
        weatherDescription: getWeatherDescription(weatherData.weathercode),
        precipitationProbability: weatherResponse.data.daily.precipitation_probability_max[0], // Assuming we want today's probability
        iconUrl: `/icons/${getWeatherIcon(weatherData.weathercode)}`,
        heatIndexCelsius: Math.round((heatIndexFahrenheit - 32) * 5 / 9),
        heatIndexFahrenheit: heatIndexFahrenheit,
        temperatureMaxCelsius: Math.round(weatherResponse.data.daily.temperature_2m_max[0]),
        temperatureMinCelsius: Math.round(weatherResponse.data.daily.temperature_2m_min[0]),
        temperatureMaxFahrenheit: Math.round((weatherResponse.data.daily.temperature_2m_max[0] * 9 / 5) + 32),
        temperatureMinFahrenheit: Math.round((weatherResponse.data.daily.temperature_2m_min[0] * 9 / 5) + 32)
      };

      setWeather(currentWeather);

      const forecastData = weatherResponse.data.daily;
      const formattedForecast = forecastData.time.map((time, index) => ({
        date: new Date(time),
        temperatureMaxCelsius: Math.round(forecastData.temperature_2m_max[index]),
        temperatureMinCelsius: Math.round(forecastData.temperature_2m_min[index]),
        temperatureMaxFahrenheit: Math.round((forecastData.temperature_2m_max[index] * 9 / 5) + 32),
        temperatureMinFahrenheit: Math.round((forecastData.temperature_2m_min[index] * 9 / 5) + 32),
        weatherCode: forecastData.weathercode[index],
        weatherDescription: getWeatherDescription(forecastData.weathercode[index]),
        precipitationProbability: forecastData.precipitation_probability_max[index]
      }));

      setForecast(formattedForecast);

      const hourlyData = weatherResponse.data.hourly;
      const formattedHourlyForecast = hourlyData.time.map((time, index) => ({
        time: new Date(time),
        temperatureCelsius: Math.round(hourlyData.temperature_2m[index]),
        temperatureFahrenheit: Math.round((hourlyData.temperature_2m[index] * 9 / 5) + 32),
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
        <h1></h1>
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

      <iframe
        title="Windy Map"
        src={`https://embed.windy.com/embed2.html?lat=${latLon.lat}&lon=${latLon.lon}&detailLat=${latLon.lat}&detailLon=${latLon.lon}&width=650&height=450&zoom=${latLon.zoom}&level=surface&overlay=radar&product=ecmwf&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
        frameBorder="0"
      ></iframe>

      <label className="switch" style={{position:'relative', top:'-26vh', left: '-21.5vw', zIndex:'999'}}>
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
          <h2 style={{position:'absolute', top: "-3.5vh", left:'0.5vw', fontSize:'24px'}}>Right Now:</h2>
            <img src={weather.iconUrl} alt={weather.weatherDescription} style={{ width: '150px', height: '150px', margin: '10px 0 0 25px' }} />
            <p style={{ fontSize: '58px', fontWeight: 'normal', color: 'white', margin: '-165px 0 0px 250px' }}>
              {isCelsius ? weather.temperatureCelsius : weather.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
            </p>
            <p style={{ fontSize: '16px', fontWeight: '100', fontStyle:"italic", color: 'rgba(255, 255, 255, 0.500)', margin: '-10px 0 10px 255px' }}>
              Feels Like: {isCelsius ? weather.heatIndexCelsius : weather.heatIndexFahrenheit}°{isCelsius ? 'C' : 'F'}
            </p>
            
            <div style={{ display: 'flex', alignItems: 'center', margin: '-25px 0 15px 235px' }}>
              <p style={{ fontSize: '20px', fontWeight: '100', color: 'rgba(145, 145, 145)', margin: '20px 5px 5px 0px' }}>
                {weather.weatherDescription} | 
                <img src={rainDropImage} alt={weather.precipitationProbability} style={{ width: '22px', height: '22px', margin: '5px 5px -5px 5px' }} />{weather.precipitationProbability}% 
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection:'row', justifyContent:"flex-start", gap:'5px', alignItems: 'flex-start', margin: '-10px 0px 0px 260px', paddingBottom:"15px" }}>
              <p style={{ fontSize: '14px', fontWeight: '100', color: '#ffa500', margin: '0px 5px 0px 0px' }}>
                H: {isCelsius ? weather.temperatureMaxCelsius : weather.temperatureMaxFahrenheit}°{isCelsius ? 'C' : 'F'} 
              </p>
              <p style={{ fontSize: '14px', fontWeight: '100', color: '#458dab', margin: '0px 5px 0px 0px' }}>
                L: {isCelsius ? weather.temperatureMinCelsius : weather.temperatureMinFahrenheit}°{isCelsius ? 'C' : 'F'}
              </p>
            </div>

            <div className="styled-line-break"></div>

            <div style={{ display: 'flex', flexDirection:'row', gap:'10px', alignItems: 'center', margin: '-15px 0 5px -10px' }}>
              <img src={locationImage} alt="Location" style={{ width: '25px', height: '25px', margin:'-5px 0 -5px 5px' }} />
              <p style={{ fontSize: '16px', margin: '25px 0' }}>{location}</p>
          
              <img src={dateTimeImage} alt="Date and Time" style={{ width: '25px', height: '25px', margin: '0px 5px 5px 15px' }} />
              <p style={{ fontSize: '14.5px', margin: '0px 0' }}>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</p>
            </div>
            
          </div>
        </>
      )}

      {forecast && (
        <div className="section forecast">
          <h2 style={{position:'absolute', top: "66vh", left:'45vw', fontSize:'30px'}}>7-Day Outlook</h2>
          <h4 style={{position:'absolute', top: "70vh", left:'45vw', fontSize:'15px'}}>* Click for hourly forecast *</h4>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-item" onClick={() => handleDayClick(index)}>
                <div className="forecast-header">
                  <span className="forecast-day">{day.date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                  <span className="forecast-date">{day.date.toLocaleDateString()}</span>
                  <div className="forecast-temp" style={{alignItems:'start', justifyContent:'end'}}>
                    <span style={{color: 'orange'}}>H: {isCelsius ? day.temperatureMaxCelsius : day.temperatureMaxFahrenheit}°{isCelsius ? 'C' : 'F'}</span>
                    <span style={{color: '#448dab'}}>L: {isCelsius ? day.temperatureMinCelsius : day.temperatureMinFahrenheit}°{isCelsius ? 'C' : 'F'}</span>
                  </div>
                </div>
                <div className="forecast-details">
                  <img src={`/icons/${getWeatherIcon(day.weatherCode)}`} alt={day.weatherDescription} style={{ width: '60px', height: '60px', display:'flex', margin:'-50px 0 0 0'  }} />
                  <span style={{color:'grey'}}>{day.weatherDescription}</span>
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
