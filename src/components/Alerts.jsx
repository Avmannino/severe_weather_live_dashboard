import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Alerts.css'; 

const Alerts = ({ lat, lon }) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (lat && lon) {
      fetchAlerts(lat, lon);
    }
  }, [lat, lon]);

  const fetchAlerts = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.weather.gov/alerts/active?point=${latitude},${longitude}`);
      setAlerts(response.data.features);
    } catch (error) {
      console.error('Error fetching alerts', error);
    }
  };

  return (
    <div className="alerts">
      <h2>Current Alerts</h2>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <h3>{alert.properties.headline}</h3>
              <p>{alert.properties.description}</p>
              <p>{alert.properties.instruction}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No current alerts for this location.</p>
      )}
    </div>
  );
};

export default Alerts;
