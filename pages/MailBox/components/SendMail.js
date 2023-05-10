import React, { useState, useEffect } from 'react';
import styles from '../css/SendMail.scss';

const SendMail = ({ display, handleCompose, token }) => {
  let towhom, subject, mailbody;
  const [emailAddress, setEmailAddress] = useState('');
  const [showCheck, setShowCheck] = useState(false);
   //useEffect is used here to prevent reading from local storage too many times
   useEffect(() => {
    const storedEmailAddress = localStorage.getItem("emailaddress");
    if (storedEmailAddress) {
      setEmailAddress(storedEmailAddress);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const towhomV = towhom.value;
    const mailbodyV = mailbody.value;
    const subjectV = subject.value;
    if (towhomV && mailbodyV && subjectV && emailAddress) {
      handleCompose(towhomV, mailbodyV, subjectV, token);
      setShowCheck(true);
      setTimeout(() => {
        setShowCheck(false);
      }, 2300);
    } else {
      return;
    }
    towhom.value = '';
    mailbody.value = '';
    subject.value = '';
  };

  return (
    <div className={'sendMail_header'} style={{ display: display }}>
      <h1>Send Email</h1>
      {token !== 'NoToken' && (
        <div>
          <p>Sending from: {emailAddress}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          To:{' '}
          <input
            type="email"
            ref={(v) => (towhom = v)}
            placeholder="email address"
          />
        </div>
        <div>
          Subject:{' '}
          <input
            type="text"
            ref={(v) => (subject = v)}
            placeholder="subject"
          />
        </div>
        <textarea
          type="textarea"
          cols="80"
          rows="7"
          ref={(v) => (mailbody = v)}
        />
        <input
          className={styles.send}
          type="submit"
          value="SEND"
          disabled={token === 'NoToken'}
        />
      </form>
      {token === 'NoToken' && (
        <p>You are currently logged out. Please log in to send emails.</p>
      )}
      <div
        className={`${styles.success} ${showCheck ? styles.successVisible : ''}`}
        id="check"
      >
        <i className="fa fa-check-circle" />
      </div>
    </div>
  );
};


export default SendMail;
