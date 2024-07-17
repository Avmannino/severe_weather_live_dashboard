import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './AlertsButton.css';

const AlertsButton = ({ lat, lon }) => {
  const [alerts, setAlerts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="alerts-button-container">
      <button
        className={`alerts-button ${alerts.length > 0 ? 'alerts-button-red' : 'alerts-button-grey'}`}
        onClick={toggleModal}
      >
        {alerts.length > 0 && <span className="notification-icon">🚨 </span>}
        Weather Alert
        {alerts.length > 0 && <span className="notification-icon"> 🚨</span>}
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Alerts Modal"
        className="alerts-modal"
        overlayClassName="alerts-overlay"
      >
        <h2 className='alerts-header'>Current Alerts for your Location:</h2>
        {alerts.length > 0 ? (
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>
                <h3 className='alerts-title'>{alert.properties.headline}</h3>
                <p className='alerts-desc'>{alert.properties.description}</p>
                <p className='alerts-instruction'>{alert.properties.instruction}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className='no-alerts'>No current alerts for your location.</p>
        )}
        <button className="close-modal-button" onClick={closeModal}>x</button>
      </Modal>
    </div>
  );
};

export default AlertsButton;
