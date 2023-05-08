//This component handles the detailed form of emails
import React, { useState } from "react";
import styles from '../css/Mail.css'
import DraftsIcon from '@mui/icons-material/Drafts';
import VoiceSettings from "./VoiceSettings";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { getprettytime } from '../utils/timeutils';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimeStorage from "./alarmEmailr/reactform/TimeStorage"
const MailDetail = ({
	mails, 
	selectedEmailID, 
	display,
	handleMarkAsRead,
}) => {
	// Add state for voice settings visibility
	const [voiceSettingsVisible, setVoiceSettingsVisible] = useState(false);
	// Add function to toggle visibility of voice settings
	const toggleVoiceSettings = () => {
	  setVoiceSettingsVisible(!voiceSettingsVisible);
	};
	
	const readAllUnreadEmails = async () => {
		// Filter the unread emails
		const unreadEmails = mails.filter(mail => mail.read === "false" && mail.tag === "inbox");
		console.log("display all the emails:",mails )
	    console.log("filtered emails:",unreadEmails )
		// Iterate through the unread emails and call speakText() for each email
		for (const email of unreadEmails) {
		  // Read the email
		  speakText(`${email.subject}. ${email.message}`);
	  
		  // Wait for the speech to finish before moving to the next email
		  await new Promise(resolve => {
			const utterThis = new window.SpeechSynthesisUtterance();
			utterThis.onend = () => {
			  resolve();
			};
			window.speechSynthesis.speak(utterThis);
		  });
		}
	};

	 // text to speech script
	 const [pitch, setPitch] = useState(1);
	 const [rate, setRate] = useState(1);
	 const [volume, setVolume] = useState(0.5);
	 const [selectedVoice, setSelectedVoice] = useState(null);
	 const [voices, setVoices] = useState([]);
	 const synth = window.speechSynthesis;
	 const populateVoices = () => {
		setVoices(window.speechSynthesis.getVoices());
	  };
	 const speakText = (message) => {
	   // Initialize voices
	   setTimeout(() => {
		 const voices = synth.getVoices();
		 setSelectedVoice(voices[0]); // Set the initial selected voice
	   }, 50);
   
	   const startRead = (message) => {
		 if (selectedVoice && synth) {
		   const utterThis = new window.SpeechSynthesisUtterance(message);
		   utterThis.voice = selectedVoice;
		   utterThis.pitch = pitch;
		   utterThis.rate = rate;
		   utterThis.volume = volume;
		   synth.speak(utterThis);
		 }
	   };
	   startRead(message);
	 };
	if(selectedEmailID === null){return <div className={styles.nothing} style={{display:display}}/>}
	const selected = mails[selectedEmailID];

	return (
		<div className = {styles.maildetail} style={{display:display}}>
			<div className ={styles.title}>
				<p className={styles.from} style={{display: selected.tag==='sent'? 'none':'inline-block'}}>FROM: {selected.from}</p>
				<p className={styles.address}>Received by: {selected.address}</p>
				<p className={styles.subject}>Title: {selected.subject}</p>
				<span>Time: {getprettytime(selected.time)}</span>
				<div >
					{selected.message}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
				<button onClick={() => {
					console.log('selected Email:',selected);
					console.log('selected Email:',selected.email_id);
					// Call the handleMarkAsRead method and pass the selected email's ID
					handleMarkAsRead(selected.email_id); 
				}}>
					<DraftsIcon />
					Move Email to Read List
				</button>
				<button onClick={() => window.location.reload()} style={{ marginLeft: '0px' }}> 
				<RefreshIcon />Refresh MailList
				</button>
				<button
 					 onClick={() => {
   					 speakText(selected.message);
  					}}
				>
  				<VolumeUpIcon />
 				 Read Email with Selected Voice 
				</button>
				<button
 					onClick={() => {
						readAllUnreadEmails();
					  }}
				>
  				<VolumeUpIcon />
 				 Read all Unread Emails
				</button>
			</div>				
			</div>
			<div >
			<div >
				<button onClick={toggleVoiceSettings}>Voice Settings</button>
					{voiceSettingsVisible && (
						<VoiceSettings
						pitch={pitch}
						setPitch={setPitch}
						rate={rate}
						setRate={setRate}
						volume={volume}
						setVolume={setVolume}
						selectedVoice={selectedVoice}
						setSelectedVoice={setSelectedVoice}
						voices={voices} 
						populateVoices={populateVoices} 
					/>
					)}

				<TimeStorage readAllUnreadEmails={readAllUnreadEmails} />
			</div>
			</div>
		</div>
			);
}

export default MailDetail;