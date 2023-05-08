import React, { useState } from "react";
import "../css/Header.css";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import Cookie from "js-cookie";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // Get the email address from local storage
  const emailaddress = localStorage.getItem("emailaddress");
  // generation of user info with the emailaddress logic
  const renderEmailAddress = () => {
    let icon, displayEmail;

    if (emailaddress.endsWith("@gmail.com")) {
      icon = <GoogleIcon />;
      displayEmail = emailaddress.replace("@gmail.com", "");
    } else if (emailaddress.endsWith("@outlook.com")) {
      icon = <OutlookIcon />;
      displayEmail = emailaddress.replace("@outlook.com", "");
    } else {
      displayEmail = emailaddress;
    }
    return (
      <>
        {icon}
        {displayEmail}
      </>
    );
  };

  function GoogleIcon() {
    return (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        alt="Google G Logo"
        width="15" 
        height="15"
      />
    );
  }
  
  //const msalInstance = new PublicClientApplication(msalConfig);
  
  function OutlookIcon() {
    return (
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
        alt="Outlook Logo"
        width="15" 
        height="15"
      />
    );
  }
  const toggleDropdown = () => { 
    setDropdownVisible(!dropdownVisible);
  };

  const UserProfileButton = () => {
    return (
      <button className="user-profile-button" onClick={toggleDropdown}>
     
        <AccountCircleIcon fontSize="large" />
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
        <div className="user-dropdown-title">{renderEmailAddress()}</div> 
        <ul>
        <li>
          <Link to="/">Return to Entrance</Link>
        </li>
        <li>
          <Link to="/" onClick={handleLogout}>Logout Account</Link>
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

export default Header;
