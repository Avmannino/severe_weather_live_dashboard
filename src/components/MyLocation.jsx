// src/components/MyLocation.jsx
import React from 'react';
import './MyLocation.css'; // Import the CSS file
import locationIcon from '/icons/location_arrow.png'; // Ensure the correct path to your image

class MyLocation extends React.Component {
  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getZipCode, this.handleLocationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  handleLocationError = (error) => {
    console.error("Error getting location:", error);
    alert("Error getting location. Please try again.");
  }

  getZipCode = async (position) => {
    const { latitude, longitude } = position.coords;
    console.log("Coordinates:", latitude, longitude); // Debugging log
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (!data.results || data.results.length === 0) {
        throw new Error('No results found in API response');
      }

      const zipCode = data.results[0].components.postcode;
      if (!zipCode) {
        throw new Error('No zip code found in API response');
      }
      
      console.log("Zip Code:", zipCode); // Debugging log
      this.props.updateSearchBar(zipCode);
    } catch (error) {
      console.error('Error fetching zip code:', error);
      alert(`Error fetching zip code. Please try again. ${error.message}`);
    }
  }

  render() {
    return (
      <button onClick={this.getLocation} className="location-button">
        <img src={locationIcon} alt="Location Icon" className="location-icon" />
        My Location
      </button>
    );
  }
}

export default MyLocation;
