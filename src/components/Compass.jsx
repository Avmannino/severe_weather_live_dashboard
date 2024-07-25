import React from 'react';
import './Compass.css';
import arrowImage from '/icons/arrow.png'; 

const Compass = ({ direction }) => {
  const rotation = `rotate(${direction}deg)`;
  return (
    <div className="compass">
      <img src={arrowImage} alt="Arrow" className="compass-arrow" style={{ transform: rotation }} />
    </div>
  );
};

export default Compass;
