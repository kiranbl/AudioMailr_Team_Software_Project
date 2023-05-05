import React, { useState, useEffect } from "react";
import "../css/Header.css";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import api from "../../../api/index";
import { connect, useDispatch } from 'react-redux';
import { fetchUserInformation } from '../../../actions/auth';
import Cookie from "js-cookie";
const Header = ({ user }) => {
  console.log("User info:", user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dispatch = useDispatch();
  const toggleDropdown = () => {
    if (!dropdownVisible) {
      //dispatch(fetchUserInformation());
    }
  
    setDropdownVisible(!dropdownVisible);
  };
  const UserProfileButton = () => {
    return (
      <button className="user-profile-button" onClick={toggleDropdown}>
      {user.profileImage ? (
        <img
        src={user.profileImage}
        alt="User Profile"
        className="user-profile-image"
      />
      ) : (
        <AccountCircleIcon fontSize="large" />
      )}
    </button>
    );
  };
  
  const handleLogout = () => {
    // Remove the token from cookies
    Cookie.remove("AUDIOMAILR_JWT");
    // Redirect the user to the login page
    window.location.href = "/";
  };

  const UserDropdown = () => {
    return (
      <div className="user-dropdown">
        <div className="user-profile-info">
          <h4>{user.name}</h4>
          <p>{user.email}</p>
        </div>
        <ul>
        <li>
          <Link to="/">Return to Log in</Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogout}>Logout Gmail Account</Link>
        </li>
        {/* Add more options as needed */}
      </ul>
      </div>
    );
  };
  return (

      <div className="header">
        <div className="middle-section">
            <VolumeUpIcon />
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>MyAudioEmailr</span>
        </div>
      <div className="user-profile-container">
        <UserProfileButton />
        {dropdownVisible && <UserDropdown />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
    return {
      user: state.auth && state.auth.user ? state.auth.user : {},
    };
  };
  
  

export default connect(mapStateToProps)(Header);
