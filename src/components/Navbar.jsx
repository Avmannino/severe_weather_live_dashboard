import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import NavImg from '/nav_logo.png'; // Adjust the path as necessary

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            <img src={NavImg} alt="Nav Logo" className="nav-img" />
            SPOT'R
          </Link>
        </div>
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
