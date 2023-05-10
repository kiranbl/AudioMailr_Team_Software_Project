import React from 'react';
import { getprettytime } from './utils/timeutils';
import styles from "./css/maillist.css";

const addFormat = (address) => {
  const len = address.length;
  if (len < 20) {
    return address;
  } else {
    return address.slice(0, 20) + '...';
  }
};
const addSubjectFormat = (subject) => {
  const len = subject.length;
  if (len < 20) {
    return subject;
  } else {
    return subject.slice(0, 17) + '...';
  }
};

const MailItem = ({ selectedEmailID, mail, openmail }) => {
  const display = mail.read === 'false' ? 'inline-block' : 'none';
  return (
    <li
	className={`${selectedEmailID === mail.id ? styles.selecteditem : styles.mailitem} ${mail.read === "true" ? "" : styles.unread}`}
      onClick={() => openmail(mail.id)}
    >
      <h5>{mail.tag === 'sent' ? addFormat(mail.address) : addFormat(mail.from)}</h5>
      <div className={styles.circle} style={{ display: display }} />
      <span>{getprettytime(mail.time)}</span>
      <p>{addSubjectFormat(mail.subject)}</p>
      <hr />
    </li>
  );
};

export default MailItem;
