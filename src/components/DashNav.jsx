// src/components/DashNav.jsx
import React from 'react';
import MyLocation from './MyLocation';
import './DashNav.css';

const DashNav = ({ searchInput, setSearchInput, handleSearch, handleKeyDown, toggleTemperatureUnit, isCelsius, updateSearchBar }) => {
  return (
    <div className="dash-nav">
      <div className="search-bar">
        <input 
          type="text" 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)} 
          onKeyDown={handleKeyDown} 
          placeholder="Enter city name or ZIP code" 
        />
        <button onClick={handleSearch}>Search</button>
        <MyLocation updateSearchBar={updateSearchBar} />
      </div>
      <label className="switch">
        <input type="checkbox" checked={isCelsius} onChange={toggleTemperatureUnit} />
        <span className="slider">
          <span className="slider-text">
            {isCelsius ? '°C' : '°F'}
          </span>
        </span>
      </label>
    </div>
  );
};

export default DashNav;
