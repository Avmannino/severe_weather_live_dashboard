// src/components/MyLocation.jsx
import React from 'react';

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
      const data = await response.json();
      console.log("API Response:", data); // Debugging log
      const zipCode = data.results[0].components.postcode;
      console.log("Zip Code:", zipCode); // Debugging log
      this.props.updateSearchBar(zipCode);
    } catch (error) {
      console.error('Error fetching zip code:', error);
      alert('Error fetching zip code. Please try again.');
    }
  }

  render() {
    return (
      <button onClick={this.getLocation}>Get My Location</button>
    );
  }
}

export default MyLocation;
