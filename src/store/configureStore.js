import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

import inboxApp from '../pages/MailBox/reducers'

export default function configureStore(initialState){
	return createStore(
		inboxApp,
		initialState,
		applyMiddleware(thunk)
		);
}
