import React from "react";
import "./SidebarOption.css";

function SidebarOption({ Icon, title, handleClick }) {
    return (
      <div className="sidebarOption">
        {Icon && <Icon className="sidebarOption__icon" onClick={handleClick} />}
        <h3 className="sidebarOption__title">{title}</h3>
      </div>
    );
  }
  

export default SidebarOption;