import React from 'react'
import {connect} from 'react-redux'
import MailDetail from '../components/Mail'

	const mapStateToProps = (state) => {
		return {
			mails: state.mails,
			selectedEmailID: state.selectedEmailID,
			display: state.composeORnot? 'none':'block'
		}
	}
    const mergeProps = (stateProps, dispatchProps, ownProps) => {
		return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		turncompose: ownProps.turncompose, 
		handleMarkAsRead: ownProps.handleMarkAsRead,
		};
	};
  
	const VMailDetail = connect(
		mapStateToProps,
		null,
		mergeProps
	)(({ ...props }) => <MailDetail handleMarkAsRead={props.handleMarkAsRead} {...props} />);
	

  
export default VMailDetail
