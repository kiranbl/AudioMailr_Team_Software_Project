import { Button } from "@mui/material";
import React from "react";
import AddIcon from '@mui/icons-material/Add';
import SidebarOption from "./SidebarOption";
import InboxIcon from '@mui/icons-material/Inbox';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch } from "react-redux";
import { openSendMessage } from "../features/mailSlice";
import styles from '../css/sidebar.scss'
const Sidebar =({currentSection, unreadcount,trashcount,sentcount,handleCategory,turncompose}) => {

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
//delete icon and its logic if needed
//<li onClick={()=>handleCategory('deleted')} className={currentSection==='deleted'? styles.currentSection :styles.notcurrentSection}>	
//               <i className='trash-o' />
//            <span>Bin</span>
//           <span className={styles.count}>{trashcount}</span></li>

export default Sidebar;