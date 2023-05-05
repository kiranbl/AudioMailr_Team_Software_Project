import React from "react";
import "./SendMail.css";
import CloseIcon from '@mui/icons-material/Close';
import { Button } from 'react-bootstrap';
/* import { useForm } from "react-hook-form"; */
import { useDispatch } from "react-redux" 
import { closeSendMessage } from "../features/mailSlice";
import styles from '../css/sendmail.css'
import $ from 'jquery'
const SendMail = ({display, handleCompose,validateAddress,validateAdd,validateText, validateT}) => {
	let towhom, subject, mailbody
	return(
	<div className ={"sendMail_header"} style={{display:display}}>
		<h1> New Message</h1>
		<form onSubmit = {(e)=> {
			e.preventDefault();
			const towhomV = towhom.value
			const mailbodyV = mailbody.value
			const subjectV = subject.value
			if(validateAdd && subject.value){
				setTimeout(function(){
					handleCompose('../inbox.json',towhomV,mailbodyV,subjectV);
					$('#check').fadeIn(800).fadeOut(300);
				},1500);
			}else{
				return
			}
			towhom.value = ''
			mailbody.value = ''
			subject.value =''
		}}>
		<div className={styles.success} id = 'check'>
			<i className='check-circle' />
		</div>
		<div className='sendMail__header'>
		<div className={styles.to}>To:
		<input type = 'text' ref={(v)=>towhom = v} placeholder = 'address' 
			className={validateAdd || validateAdd === null? '' : styles.wrongFormat}
			onBlur = {()=> validateAddress(towhom.value)}/>
		</div>
		<div className={'sendMail__header'}>Subject:
		<input type ='text' ref={(v) => subject = v} placeholder='subject' 
			className = {validateText || validateText === null? '':styles.wrongFormat}
			onBlur = {() => validateT(subject.value)}/>
		</div>
		</div>
		<textarea type ='textarea' cols='80' rows='7' ref={(v) => mailbody = v}/>
		<input className={styles.send} type='submit' value='SEND'/>
		</form>
	</div>
		);                                      
}

export default SendMail;