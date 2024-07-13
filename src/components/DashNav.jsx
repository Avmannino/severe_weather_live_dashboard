import React from 'react';
import MyLocation from './MyLocation';
import './DashNav.css';

const DashNav = ({ toggleTemperatureUnit, isCelsius, searchInput, setSearchInput, handleSearch, handleKeyDown, updateSearchBar }) => {
  return (
    <div className="dash-nav">
        <label className="switch">
            <input type="checkbox" checked={isCelsius} onChange={toggleTemperatureUnit} />
            <span className="slider">
            <span className="slider-text">
                {isCelsius ? '°C' : '°F'}
            </span>
            </span>
        </label>
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
    </div>
  );
};

export default DashNav;
