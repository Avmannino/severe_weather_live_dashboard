import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
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
        {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-login">
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
