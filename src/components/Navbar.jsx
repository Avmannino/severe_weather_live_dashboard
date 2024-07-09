// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          SPOTT'R
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/home" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-links">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/radar" className="nav-links">
              Radar
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reports" className="nav-links">
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
