import React from "react";
//import { Checkbox } from "@mui/material";
//import EmailRow from "../EmailRow";
import MailItem from '../mailitem'
import styles from '../css/maillist.scss'

const MailList = ({searchText, selectedEmailID,showunread, display,mails, currentSection, turnunread, openmail}) => {
	const displayMail = mails.filter(mail=> mail.tag === currentSection);
	const displayMails = displayMail.filter(mail => mail.from.includes(searchText)
				|| mail.address.includes(searchText)
				|| mail.message.includes(searchText)
				|| mail.subject.includes(searchText))
	return (
		<div className = {styles.maillist} style={{display: display}}>
		<div className={styles.buttons}>
			<button onClick={()=>turnunread(false)} className={showunread?styles.unred:styles.red}>All</button>
			<button onClick={()=>turnunread(true)} className={showunread?styles.red:styles.unred}>Unread</button>
			</div>
		<ul>
			{displayMails.map(mail =>
				{
					console.log('EmailList - mail:', mail); 
					return<MailItem openmail={openmail} selectedEmailID ={selectedEmailID} mail={mail}/>
				}
			)
			}
		</ul>
		</div>);
}

export default MailList;