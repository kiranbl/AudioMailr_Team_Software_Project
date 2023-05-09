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
	const unreadinboxcount = (mail => mail.tag === 'inbox' && mail.read === 'false');
	//const inboxcount = mails.filter(mail => mail.tag === 'inbox');
	console.log("count inbox:",unreadinboxcount.length)
	return unreadinboxcount.length;
}

function countsent(mails){
	const sentcount = mails.filter(mail => mail.tag === 'sent')
	console.log("count sent:",sentcount.length)
	return sentcount.length
}