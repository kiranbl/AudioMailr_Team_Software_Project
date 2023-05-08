import {connect} from 'react-redux'
import SendMail from '../components/SendMail'
import api from '../../../api/index';
import { getStorageData } from "../utils/utils";
const mapStateToProps = (state) => {
	return {
		mails: state.mails,
		display: state.composeORnot? 'block':'none',
		validateAdd : state.validateAdd,
		validateText: state.validateText,
		token: getStorageData("AUDIOMAILR_JWT", "NoToken")
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	  handleCompose: (toAddress, toMessage, toSubject, token) => {
		console.log('Sending email with data:', {
		  toAddress,
		  toMessage,
		  toSubject,
		  token,
		});
		dispatch(api.sendEmails(toAddress, toMessage, toSubject, token));
	  },
	};
  };
  

const VComposePart = connect(mapStateToProps, mapDispatchToProps)(SendMail)

export default VComposePart

