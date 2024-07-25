import React from 'react';
import './Drawer.css';

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <button className="drawer-close" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
