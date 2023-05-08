import React from 'react';
import styles from "./css/maillist.css";
import { getprettytime } from './utils/timeutils';


const addFormat = (address) => {
  const len = address.length;
  if (len < 20) {
    return address;
  } else {
    return address.slice(0, 20) + '...';
  }
};

const MailItem = ({ selectedEmailID, mail, openmail }) => {
  const display = mail.read === 'false' ? 'inline-block' : 'none';
  return (
    <li
	className={`${selectedEmailID === mail.id ? styles.selected : styles.mailitem} ${mail.read === "true" ? "" : styles.unread}`}
      onClick={() => openmail(mail.id)}
    >
      <h5>{mail.tag === 'sent' ? addFormat(mail.address) : addFormat(mail.from)}</h5>
      <div className={styles.circle} style={{ display: display }} />
      <span>{getprettytime(mail.time)}</span>
      <p>{mail.subject}</p>
    </li>
  );
};

export default MailItem;
