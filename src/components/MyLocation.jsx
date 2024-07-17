import React from 'react';
import './MyLocation.css'; 
import locationIcon from '/icons/location_arrow.png'; 

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
    console.log("Coordinates:", latitude, longitude); 
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data); 

      if (!data.results || data.results.length === 0) {
        throw new Error('No results found in API response');
      }

      const zipCode = data.results[0].components.postcode;
      if (!zipCode) {
        throw new Error('No zip code found in API response');
      }
      
      console.log("Zip Code:", zipCode);
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
      </button>
    );
  }
}

export default MyLocation;
