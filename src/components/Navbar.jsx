import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profilePictureUrl, setProfilePictureUrl] = useState('./icons/profile-icon.png'); // Default icon

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              src={isAuthenticated ? profilePictureUrl : './icons/placeholder-icon.png'}
              alt="Profile"
              className="navbar-profile-picture"
            />
          </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
