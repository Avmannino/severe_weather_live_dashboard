import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLocation from './MyLocation';
import './DashNav.css';

const DashNav = ({
  toggleTemperatureUnit,
  isCelsius,
  searchInput,
  setSearchInput,
  handleSearch,
  handleKeyDown,
  updateSearchBar,
  searchConducted
}) => {
  const navigate = useNavigate();
  const [profilePictureUrl] = useState('./icons/profile-icon.png'); // Default icon

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/my-account');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="dash-nav">
      {searchConducted && (
        <label className="switch">
          <input type="checkbox" checked={isCelsius} onChange={toggleTemperatureUnit} />
          <span className="slider">
            <span className="slider-text">
              {isCelsius ? '°C' : '°F'}
            </span>
          </span>
        </label>
      )}
      <div className="search-bar">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter city name or ZIP code"
        />
        <button className='search-button' onClick={handleSearch}>Search</button>
        <button className="location-button">
          <MyLocation updateSearchBar={updateSearchBar} />
        </button>
        <div className="profile-icon" onClick={handleProfileClick}>
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default DashNav;
