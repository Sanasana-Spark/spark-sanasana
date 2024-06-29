import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="welcome-message">
        <h2>Welcome Ami</h2>
        <p>Manage all your assets in one place</p>
      </div>
      <div className="navbar-right">
        <FontAwesomeIcon icon={faBell} className="bell-icon" />
        <div className="user-info">
          <img src="/assets/user.png" alt="User" className="user-img" />
          <span>Ami</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
