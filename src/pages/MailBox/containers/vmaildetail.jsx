import React from 'react'
import {connect} from 'react-redux'
import MailDetail from '../components/Mail'
import {postData, putData} from '../actions/fetchData'

const mapStateToProps = (state) => {
	return {
		mails: state.mails,
		selectedEmailID: state.selectedEmailID,
		display: state.composeORnot? 'none':'block'
	}
}


const mapDispatchToProps = (dispatch) => {
	return {
	  handlecompose: (url, address, message, subject) => {
		dispatch(postData(url, address, message, subject));
	  },
	  //delete method that we may or may not need
	  deletemailDispatch: (url, tag, origTag) => {
		dispatch(putData(url, "tag", tag));
		dispatch({
		  type: "MOVE_MAIL",
		  origTag: origTag,
		});
	  },
	  // mark as read/unread methods that we must have
	  markAsRead: (id,mail) => {
		console.log('markAsRead called with id:', id, 'and mail:', mail);
		const updatedMail = { ...mail, read: "true" };
		//dispatch(putData('../inbox.json', id, updatedMail));
		dispatch(putData('http://localhost:3000/mails', id, updatedMail));
	  },
	  markAsUnread: (id,mail) => {
		console.log('markAsUnread called with id:', id, 'and mail:', mail);
		const updatedMail = { ...mail, read: "false" };
		//dispatch(putData('../inbox.json', id, updatedMail));
		dispatch(putData('http://localhost:3000/mails', id, updatedMail));
	  },
	};
  };
  
  const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return {
	  ...stateProps,
	  ...dispatchProps,
	  ...ownProps,
	  deletemail: (url, mails, id, origTag) => {
		dispatchProps.deletemailDispatch(url, "deleted", origTag);
	  },
	  markAsRead: (id) => {
		const mail = stateProps.mails[id];
		console.log('Calling markAsRead with mail:', mail);
		dispatchProps.markAsRead(id, mail);
	  },
	  markAsUnread: (id) => {
		const mail = stateProps.mails[id];
		console.log('Calling markAsUnread with mail:', mail);
		dispatchProps.markAsUnread(id, mail);
	  },
	};
  };
  
  const VMailDetail = connect(mapStateToProps, mapDispatchToProps, mergeProps)(MailDetail);

  

export default VMailDetail

function timeFormat(time){
	const timepart = time.toTimeString().split(' ')[0]
	const datepart = time.toLocaleDateString().split('/').join('-')

	return `${datepart} ${timepart}`
}