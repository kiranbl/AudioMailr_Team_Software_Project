import React from "react";
import AddIcon from '@mui/icons-material/Add';
import SidebarOption from "./SidebarOption";
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import styles from '../css/sidebar.scss'
const Sidebar =({currentSection, unreadcount,sentcount,handleCategory,turncompose}) => {

    return (       
        <div className={styles.sidebar}>           
          <button startIcon={<AddIcon fontSize="large"/>}
                  className="sidebar_compose"
                  onClick={turncompose}
          >
            <i className="pencil-square-o"/>Compose
          </button>
          <ul>
            <li onClick ={()=>handleCategory('inbox')} className={currentSection==='inbox'? styles.currentSection :styles.notcurrentSection}>
              <SidebarOption Icon={InboxIcon} title="Inbox">
                <span className={styles.count}>{unreadcount}</span>
              </SidebarOption>
            </li>
            <li onClick={()=>handleCategory('sent')} className={currentSection==='sent'? styles.currentSection :styles.notcurrentSection}>
              <SidebarOption Icon={SendIcon} title="Sent">
                <span className={styles.count}>{sentcount}</span>
              </SidebarOption>
            </li>
          </ul>
        </div>
      )
      
}

export default Sidebar;