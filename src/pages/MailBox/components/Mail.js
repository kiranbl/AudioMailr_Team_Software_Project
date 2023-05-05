//This component handles the detailed form of emails
import React, { useState } from "react";
import $ from 'jquery'
import styles from '../css/maildetail.css'
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DraftsIcon from '@mui/icons-material/Drafts';
import VoiceSettings from "./VoiceSettings";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { getprettytime } from '../utils/timeutils';


const MailDetail = ({
	mails, 
	selectedEmailID, 
	display,
	handlecompose,
	markAsRead,
	markAsUnread, 
}) => {
	console.log('MailDetail - selectedEmailID:', selectedEmailID); // check if email is selected
	
	// Add state for voice settings visibility
	const [voiceSettingsVisible, setVoiceSettingsVisible] = useState(false);

	// Add function to toggle visibility of voice settings
	const toggleVoiceSettings = () => {
	  setVoiceSettingsVisible(!voiceSettingsVisible);
	};
  
	const readAllUnreadEmails = async () => {
		// Filter the unread emails
		const unreadEmails = mails.filter(mail => mail.read === "false");
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

	let subject, message,address;
	return (
		<div className = {styles.maildetail} style={{display:display}}>
			<div className ={styles.title}>
				<p className={styles.from} style={{display: selected.tag==='sent'? 'none':'inline-block'}}>FROM: {selected.from}</p>
				<p className={styles.address}>Received by: {selected.address}</p>
				<p className={styles.subject}>Title: {selected.subject}</p>
				<span>Time: {getprettytime(selected.time)}</span>
			
				<button onClick={() => {
					console.log('Mark as unread button clicked');
  					markAsUnread(selectedEmailID);
				}}>
  				<MailOutlineIcon />
  					Mark as unread
				</button>

				<button onClick={() => {
					console.log('Mark as read button clicked');
 					 markAsRead(selectedEmailID);
				}}>
  				<DraftsIcon />
  					Mark as read
				</button>

				<button
 					 onClick={() => {
   					 speakText(selected.message);
  					}}
				>
  				<VolumeUpIcon />
 				 Read for me with selected voice settings
				</button>
				<button
 					onClick={() => {
						console.log('Mark as read button clicked');
						readAllUnreadEmails();
					  }}
				>
  				<VolumeUpIcon />
 				 Read all unread Emails
				</button>
				
				
			</div>
			<div className={styles.background}>
			<div className = {styles.body}>
			{selected.message}
			</div>
			<div className = {styles.reply}>
				<form onSubmit = {(e) => {e.preventDefault();
					if(!message.value.trim()){return;}
					const subject = 'reply:'+ selected.subject;
					const messageV = message.value;
					setTimeout(function(){	
						handlecompose('../inbox.json',selected.address, messageV, subject);	
						$('#check').fadeIn(800).fadeOut(300);
					},1500)
					message.value ='';
				}}>
				<br/>
				<div className={styles.success} id = 'check'>
					<i className='check-circle' />
				</div>
				<textarea cols='75' rows='5'  ref={v => message = v} />
				<input className ={styles.send} type ='submit' value='Reply'/>
				</form>
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
						voices={voices} // Add this line
						populateVoices={populateVoices} // Add this line
					/>
					)}
			</div>
			</div>
		</div>

			);
}

export default MailDetail;