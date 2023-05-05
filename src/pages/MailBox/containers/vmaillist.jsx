import React from 'react'
import MailList from '../components/EmailList'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    return {
      searchText: state.searchText,
      selectedEmailID: state.selectedEmailID,
      showunread: state.showUnread,
      mails: state.showUnread? state.mails.filter(mail => mail.read==='false') : state.mails,
      currentSection: state.currentSection,
      display: state.composeORnot ? "none" : "block",
    };
  };
  


const mapDispatchToProps = (dispatch) => {
	return {
		turnunread: (bool) => {dispatch({type:'TURN_UNREAD', bool})},
		openmail: (id)=> {
      console.log('openmail called with id:', id); // Add this line
      dispatch({type: 'OPEN_MAIL', id})
    }
}
}

const VMailList = connect(mapStateToProps,mapDispatchToProps)(MailList)

export default VMailList