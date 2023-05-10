import {connect} from 'react-redux'
import Mailbox from '../components/App.js'
import {fetchData} from '../actions/fetchData.js'

const mapStateToProps = (state) => {
	return {
		mails: state.mails
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		fetchData: (url) => {dispatch(fetchData(url))}
	}
}

const VMailbox = connect(mapStateToProps,mapDispatchToProps)(Mailbox)

export default VMailbox