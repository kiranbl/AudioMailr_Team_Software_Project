import { combineReducers } from "redux";
import flash from "./flash";
import auth from "./auth";
import inboxApp from "../pages/MailBox/reducers";
const rootReducer = combineReducers({
    flash,
    auth,
    mail: inboxApp
});

export default rootReducer;
