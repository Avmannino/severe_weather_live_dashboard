// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DayOrNight = ({ lat, lon }) => {
//   const [isDay, setIsDay] = useState(null);

//   useEffect(() => {
//     const fetchDayNightStatus = async () => {
//       if (lat && lon) {
//         try {
//           const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
//           const currentWeather = response.data.current_weather;

//           // Log entire currentWeather object to inspect its structure
//           console.log('Current Weather:', currentWeather);

//           // Extract sunrise and sunset from currentWeather if available
//           const sunrise = currentWeather.sunrise ? new Date(currentWeather.sunrise) : null;
//           const sunset = currentWeather.sunset ? new Date(currentWeather.sunset) : null;
//           const now = new Date();

//           console.log('Sunrise:', sunrise);
//           console.log('Sunset:', sunset);
//           console.log('Now:', now);

//           if (sunrise && sunset) {
//             setIsDay(now >= sunrise && now < sunset);
//           } else {
//             console.error('Sunrise or sunset not available in API response');
//             // Handle the case where sunrise or sunset is not available
//           }
//         } catch (error) {
//           console.error('Error fetching day/night status', error);
//         }
//       }
//     };

//     fetchDayNightStatus();
//   }, [lat, lon]);

//   if (isDay === null) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       {isDay ? <p>It is day.</p> : <p>It is night.</p>}
//     </div>
//   );
// };

// export default DayOrNight;
