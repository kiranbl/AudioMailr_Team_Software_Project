import React from 'react'
import Sidebar from '../components/Sidebar'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
	return {
		currentSection: state.currentSection,
		unreadcount: countunread(state.mails),
		sentcount: countsent(state.mails)
	}
}

const mapDispatchToProps = (dispatch) =>{
	return {
		turncompose: () => {
			dispatch({type: 'TURN_COMPOSE'})
		},
		handleCategory: (tag) =>{
			dispatch({type: 'SELECT_TAG', tag: tag})
		}
	}
}

const VSidebar = connect(mapStateToProps,mapDispatchToProps)(Sidebar)
export default VSidebar

function countunread(mails){
	const unread = mails.filter(mail => mail.tag === 'inbox' && mail.read === 'false');
	return unread.length;
}

function countsent(mails){
	const sent = mails.filter(mail => mail.tag === 'sent')
	return sent.length
}