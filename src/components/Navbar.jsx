import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePictureUrl] = useState('./icons/profile-icon.png'); // Default icon

  const handleProfileClick = () => {
    navigate(isAuthenticated ? '/my-account' : '/login');
  };

  const navbarClass = location.pathname === '/' || location.pathname === '/home' ? 'navbar navbar-home' : 'navbar';

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/home" className="navbar-logo">
            SPOTT'R
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
            <Link to="/pricing" className="nav-links">
              Pricing
            </Link>
          </li>
          <li className="nav-item dropdown">
            <Link to="/about-us" className="nav-links">
              About Us <span className="nav-caret">&#9662;</span>
            </Link>
            <ul className="dropdown-menu">
              <li>
                <Link to="/contact-us" className="dropdown-link">
                  Contact Us 📞
                </Link>
              </li>
            </ul>
          </li>
        </ul>
        <div className="navbar-right">
          <div className="navbar-profile-icon" onClick={handleProfileClick}>
            <img
              src={profilePictureUrl}
              alt="Profile"
              className="navbar-profile-picture"
            />
          </div>
          {isAuthenticated ? (
            <button onClick={() => onLogout(navigate)} className="nav-login">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
