import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';
import './Dashboard.css';
import Drawer from './Drawer'; 
import WeatherCards from './WeatherCards';
import DashNav from './DashNav';
import AlertsButton from './AlertsButton'; 

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
  61: 'rain.png',
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

const defaultCities = [
  { name: 'Los Angeles, CA', lat: 34.0522, lon: -118.2437 },
  { name: 'New York, NY', lat: 40.7128, lon: -74.0060 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522 },
  { name: 'Kiev, Ukraine', lat: 50.4501, lon: 30.5234 }
];

const Dashboard = () => {
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [isCelsius, setIsCelsius] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [latLon, setLatLon] = useState({ lat: 50.4, lon: 14.3, zoom: 5 });
  const [searchConducted, setSearchConducted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [defaultWeather, setDefaultWeather] = useState([]);
  const [humidity, setHumidity] = useState(null);
  const [apparentTemperature, setApparentTemperature] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      const weatherData = await Promise.all(defaultCities.map(async (city) => {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`);
        const data = response.data.current_weather;
        const cityTime = DateTime.local().setZone(response.data.timezone).toLocaleString(DateTime.TIME_SIMPLE);
        return {
          ...city,
          temperature: Math.round(data.temperature),
          weatherCode: data.weathercode,
          weatherDescription: getWeatherDescription(data.weathercode),
          iconUrl: `/icons/${getWeatherIcon(data.weathercode)}`,
          localTime: cityTime
        };
      }));
      setDefaultWeather(weatherData);
    };

    fetchDefaultWeather();
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

      setLatLon({ lat, lon, zoom: 20 });

      const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max&hourly=temperature_2m,weathercode,apparent_temperature&timezone=auto`);

      const weatherData = weatherResponse.data.current_weather;
      const hourlyData = weatherResponse.data.hourly;

      // Current hour's apparent temperature
      const currentHourIndex = new Date().getHours();
      const apparentTemperatureCelsius = hourlyData.apparent_temperature[currentHourIndex];
      const apparentTemperatureFahrenheit = Math.round((apparentTemperatureCelsius * 9 / 5) + 32);

      const temperatureFahrenheit = Math.round((weatherData.temperature * 9 / 5) + 32);

      const currentWeather = {
        temperatureCelsius: Math.round(weatherData.temperature),
        temperatureFahrenheit: temperatureFahrenheit,
        humidity: humidity || 50, 
        windSpeed: weatherData.windspeed,
        windDirection: weatherData.winddirection,
        weatherCode: weatherData.weathercode,
        weatherDescription: getWeatherDescription(weatherData.weathercode),
        precipitationProbability: weatherResponse.data.daily.precipitation_probability_max[0],
        iconUrl: `/icons/${getWeatherIcon(weatherData.weathercode)}`,
        heatIndexCelsius: apparentTemperatureCelsius,
        heatIndexFahrenheit: apparentTemperatureFahrenheit,
        temperatureMaxCelsius: Math.round(weatherResponse.data.daily.temperature_2m_max[0]),
        temperatureMinCelsius: Math.round(weatherResponse.data.daily.temperature_2m_min[0]),
        temperatureMaxFahrenheit: Math.round((weatherResponse.data.daily.temperature_2m_max[0] * 9 / 5) + 32),
        temperatureMinFahrenheit: Math.round((weatherResponse.data.daily.temperature_2m_min[0] * 9 / 5) + 32)
      };

      setWeather(currentWeather);
      setApparentTemperature(isCelsius ? apparentTemperatureCelsius : apparentTemperatureFahrenheit);

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

      const formattedHourlyForecast = hourlyData.time.map((time, index) => ({
        time: new Date(time),
        temperatureCelsius: Math.round(hourlyData.temperature_2m[index]),
        temperatureFahrenheit: Math.round((hourlyData.temperature_2m[index] * 9 / 5) + 32),
        weatherCode: hourlyData.weathercode[index],
        weatherDescription: getWeatherDescription(hourlyData.weathercode[index])
      }));

      setHourlyForecast(formattedHourlyForecast);
      setSearchConducted(true);
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
    if (weather) {
      setApparentTemperature(isCelsius ? weather.heatIndexFahrenheit : weather.heatIndexCelsius);
    }
  };

  const handleDayClick = (index) => {
    setSelectedDay(index);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
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

  const updateSearchBar = (zipCode) => {
    setSearchInput(zipCode);
    handleSearch();
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1></h1>
      </header>

      <DashNav  
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
        handleKeyDown={handleKeyDown}
        toggleTemperatureUnit={toggleTemperatureUnit}
        isCelsius={isCelsius}
        updateSearchBar={updateSearchBar}
      />

      {!searchConducted && (
        <div className="default-view">
          <h2>Welcome to the Weather Dashboard</h2>
          <p>Enter a city name or ZIP code to get started.</p>
          <div className="default-weather-cards animate__animated animate__fadeInUp animate__delay-0s">
            {defaultWeather.map((cityWeather, index) => (
              <div key={index} className="default-weather-card animate__animated animate__fadeInUp animate__delay-0s">
                <h3>{cityWeather.name}</h3>
                <p className='local-time'>{cityWeather.localTime}</p>
                <p className='default-temp animate__animated animate__fadeInUp animate__delay-1s'>{cityWeather.temperature}°C</p>
                <img src={cityWeather.iconUrl} alt={cityWeather.weatherDescription} />
              </div>
            ))}
          </div>
          <iframe className='default-map'
            title="Map"
            src={`https://embed.windy.com/embed2.html?lat=${latLon.lat}&lon=${latLon.lon}&detailLat=${latLon.lat}&detailLon=${latLon.lon}&width=650&height=450&zoom=${latLon.zoom}&level=surface&overlay=radar&product=ecmwf&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
          ></iframe>
        </div>
      )}

      {searchConducted && (
        <>
          <iframe
            title="Windy Map"
            src={`https://embed.windy.com/embed2.html?lat=${latLon.lat}&lon=${latLon.lon}&detailLat=${latLon.lat}&detailLon=${latLon.lon}&width=650&height=450&zoom=${latLon.zoom}&level=surface&overlay=radar&product=ecmwf&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
            frameBorder="0"
          ></iframe>

          {weather && (
            <>
              <div className="section current-weather">
                <img src={weather.iconUrl} alt={weather.weatherDescription} />
                <p className='current-temp'>
                  {isCelsius ? weather.temperatureCelsius : weather.temperatureFahrenheit}°{isCelsius ? 'C' : 'F'}
                </p>
                <p className='feels-like'>
                  Feels Like: {isCelsius ? weather.heatIndexCelsius : weather.heatIndexFahrenheit}°{isCelsius ? 'C' : 'F'}
                </p>

                <div className='weather-desc'>
                  <p>
                    {weather.weatherDescription} | 
                    <img src={rainDropImage} alt={weather.precipitationProbability} style={{ width: '22px', height: '22px', margin: '5px 5px -5px 2px' }} />{weather.precipitationProbability}% 
                  </p>
                </div>

                <div className='hi-lo'>
                  <p style={{color: '#ffa500'}}>
                    H: {isCelsius ? weather.temperatureMaxCelsius : weather.temperatureMaxFahrenheit}°{isCelsius ? 'C' : 'F'} 
                  </p>
                  <p style={{color: '#3b728b'}}>
                    L: {isCelsius ? weather.temperatureMinCelsius : weather.temperatureMinFahrenheit}°{isCelsius ? 'C' : 'F'}
                  </p>
                </div>

                <div className='location'>
                  <img src={locationImage} alt="Location" style={{ width: '25px', height: '25px', margin:'-5px 0 -5px 5px' }} />
                  <p>{location}</p>
                </div>

                <div className='time'>
                  <img src={dateTimeImage} alt="Date and Time" style={{ width: '25px', height: '25px', margin: '0px 0px 0px 55px' }} />
                  <p>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</p>
                </div>
              </div>
            </>
          )}

          {forecast && (
            <div className="section forecast">
              <h2>7-Day Outlook</h2>
              <h4>* Click for hourly forecast *</h4>
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
                      <img src={`/icons/${getWeatherIcon(day.weatherCode)}`} alt={day.weatherDescription} style={{ width: '60px', height: '60px', display:'flex', margin:'-55px 0 0 0'  }} />
                      <span style={{color:'white', margin:'5px 0 0 0'}}>{day.weatherDescription}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchConducted && (
            <div className='weather-cards'>
              <WeatherCards lat={latLon.lat} lon={latLon.lon} setHumidity={setHumidity} />
            </div>
          )}

          <AlertsButton lat={latLon.lat} lon={latLon.lon} /> 

          <Drawer isOpen={drawerOpen} onClose={closeDrawer}>
            {selectedDay !== null && (
              <div className="hourly-forecast-grid">
                {getHourlyForecastForDay(forecast[selectedDay]).map((hour, hourIndex) => (
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
          </Drawer>
        </>
      )}
    </div>
  );
}

export default Dashboard;
