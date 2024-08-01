import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLocation from './MyLocation';
import './DashNav.css';
import { useAuth } from './AuthContext';

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
  const { isAuthenticated } = useAuth();
  const [profilePictureUrl, setProfilePictureUrl] = useState('./icons/profile-icon.png'); // Default icon

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (isAuthenticated) {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch('http://127.0.0.1:5000/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setProfilePictureUrl(data.profilePictureUrl ? `http://127.0.0.1:5000/uploads/${data.profilePictureUrl}` : './icons/profile-icon.png');
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }
    };

    fetchProfilePicture();
  }, [isAuthenticated]);

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
            src={isAuthenticated ? profilePictureUrl : './icons/placeholder-icon.png'}
            alt="Profile"
            className="profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default DashNav;
