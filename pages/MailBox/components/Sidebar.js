import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import SidebarOption from "./SidebarOption";
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import '../css/sidebar.scss'

const Sidebar = ({currentSection, unreadcount, sentcount, handleCategory, turncompose}) => {
    return (       
        <div className="sidebar">           
          <button className="sidebar_compose" onClick={turncompose}>
            <EditIcon fontSize="large" />
          </button>
          <ul>
            <li onClick ={()=>handleCategory('inbox')} className={currentSection==='inbox'? 'currentSection' :'notcurrentSection'}>
              <SidebarOption Icon={InboxIcon} title="Inbox" />            
            </li>
            <li onClick={()=>handleCategory('sent')} className={currentSection==='sent'? 'currentSection' :'notcurrentSection'}>
              <SidebarOption Icon={SendIcon} title="Sent" />
            </li>
          </ul>
        </div>
      )
}

export default Sidebar;
