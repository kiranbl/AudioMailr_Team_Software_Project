import { combineReducers } from "redux";
import flash from "./flash";
import auth from "./auth";
import mailReducer from '../pages/MailBox/features/mailSlice'; 

const rootReducer = combineReducers({
    flash,
    auth,
    mail: mailReducer 
});

export default rootReducer;
