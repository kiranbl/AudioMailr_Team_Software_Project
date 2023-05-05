	import {combineReducers} from 'redux'
	import auth from '../../reducers/auth';
	import { SET_EMAILS } from '../../constants/index';

	//mails/currentSection/selectedEmailID/composeORnot
	//1、mails


	const mails = (state = [], action) => {
		switch (action.type) {
		  	case 'FETCH_DATA_SUCCESS':
				console.log('action.mails:', action.mails);
			let id = 0;
				for (const mail of action.mails) {
			  		if (typeof mail !== 'object') {
						console.error('Invalid mail data:', mail);
							continue;
			  			}
			  	mail.id = id++;
			}
				return action.mails;
			case 'TOGGLE_READ_STATUS':
      			return state.map(mail => {
        		if (mail.id === action.id) {
          			return { ...mail, isRead: !mail.isRead };
        		}
        		return mail;				
      		});
			
			
			case SET_EMAILS: 
			console.log('SET_EMAILS_action.emails:', action.emails);
			let idCounter = 0;
				for (const email of action.emails) {
				if (typeof email !== 'object') {
					console.error('Invalid email data:', email);
					continue;
				}
				email.id = idCounter++;
			}
			  return action.emails;
			
		  default:
			return state;
		}
	  };
	  

	const hasError = (state = false, action) => {
		switch(action.type){
			case 'HAS_ERRORED':
				return action.hasErrored
			default:
				return state
		}
	}

	const searchText = (state ='', action) => {
		switch(action.type){
			case 'SEARCH_MAIL':
				return action.value;
			default:
				return state
			}
	}

	//2、currentSection

	const currentSection = (state = 'inbox', action) => {
		switch(action.type){
			case 'SELECT_TAG':
				return action.tag;
			default:
				return state
		}
	}

	//3、selected

	const selectedEmailID = (state = null, action) => {
		switch(action.type){
			case 'OPEN_MAIL':
				console.log('selectedEmailID reducer - action:', action);
				return action.id;
			case 'MOVE_MAIL':
				const mails = action.mails
				const selected = mails.find(mail => mail.tag === action.origTag && mail.id > action.id);
				if(!selected){return null}
				return selected.id
			case 'SELECT_TAG':
				return null
			default:
				return state
		}
	}

	//4、composeORnot
	//if true，maillist & maildetailare hidden，only displays composepart
	//if false, the contrary
	const composeORnot = (state = false,action) => {
		switch(action.type){
			case 'TURN_COMPOSE':
				return !state;
			case 'SELECT_TAG':
				return false
			default:
				return state
		}
	}
	//add unread
	const showUnread = (state = false, action) => {
		switch(action.type){
			case 'TURN_UNREAD':
				return action.bool;
			default: 
				return state
		}
	}
	//6、add new validateAdd和validateText，
	//Check whether the address meets the format requirements, and whether the subject is filled in
	const validateAdd = (state = null, action) => {
		switch(action.type){
			case 'VALIDATE':
				const regExp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
				const flag = regExp.test(action.value)
				return flag
			default:
				return state
		}
	}
	const validateText = (state = null, action) => {
		switch(action.type){
			case 'VALIDATE_TEXT':
				if(action.value === ''){
					return false
				}
				return true
			default:
				return state
		}
	}

	const inboxApp = combineReducers({auth,mails,hasError,searchText,currentSection,selectedEmailID,composeORnot,showUnread,validateAdd,validateText});
	export default inboxApp

