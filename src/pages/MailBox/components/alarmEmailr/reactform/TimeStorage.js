import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAob-IJWewda_XEEqhTjp8aZtwQ3e4ymz8",
  authDomain: "my-audio-emailer.firebaseapp.com",
  projectId: "my-audio-emailer",
  storageBucket: "my-audio-emailer.appspot.com",
  messagingSenderId: "801207008698",
  appId: "1:801207008698:web:649ddd92c31df7798bb183"
};
//notification check
async function notifyUser() {
  if (!("Notification" in window)) {
    console.log("This browser does not support system notifications.");
  } else if (Notification.permission === "granted") {
    new Notification("Reading mail...");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification("Reading mail...");
      }
    });
  }
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TimeStorage = ({ readAllUnreadEmails }) => {
  const [time, setTime] = useState('');
  const [ukTime, setUkTime] = useState('');
  const [emailsRead, setEmailsRead] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      const ukTimeString = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false });
      setUkTime(ukTimeString);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function saveTime() {
    setEmailsRead(false); 
    const timeRef = doc(db, "users", "1");

    try {
      await setDoc(timeRef, {
        savedTime: time,
      });
      console.log("Time saved");
    } catch (error) {
      console.error("Error saving time:", error);
    }
  }

  const loadTime = useCallback(async () => {
    if (emailsRead) return;
    const timeRef = doc(db, "users", "1");

    try {
      const docSnap = await getDoc(timeRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const savedTime = data.savedTime;

        if (ukTime.slice(0, 5) === savedTime) {
          console.log("Time matched!");
          notifyUser();
          readAllUnreadEmails();
          setEmailsRead(true);
        }
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error("Error loading time:", error);
    }
  }, [ukTime, readAllUnreadEmails, emailsRead]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await loadTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [loadTime]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button onClick={saveTime}>Save Time</button>
      </div>
      <div> UK Time: <span>{ukTime}</span></div>
    </div>
  );
};

export default TimeStorage;
