import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DayOrNight = ({ lat, lon }) => {
  const [isDay, setIsDay] = useState(null);

  useEffect(() => {
    const fetchDayNightStatus = async () => {
      if (lat && lon) {
        try {
          const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
          const currentWeather = response.data.current_weather;
          const sunrise = new Date(currentWeather.sunrise);
          const sunset = new Date(currentWeather.sunset);
          const now = new Date();

          setIsDay(now >= sunrise && now < sunset);
        } catch (error) {
          console.error('Error fetching day/night status', error);
        }
      }
    };

    fetchDayNightStatus();
  }, [lat, lon]);

  if (isDay === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {isDay ? <p>It is day.</p> : <p>It is night.</p>}
    </div>
  );
};

export default DayOrNight;
