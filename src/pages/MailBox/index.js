// Main entrance of app, includes all routes
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import VAPP from "../pages/MailBox/containers/vmailbox.jsx";
import configureStore from "../pages/MailBox/app/configureStore";
import SignUpPage from "../pages/SignUp/SignUpPage";
import SignInPage from "../pages/SignIn/SignInPage";
import HeaderNav from "../components/HeaderNav";
import FlashMessageList from "../components/Flash/FlashMessageList";
import { Provider } from "react-redux";

const mailboxStore = configureStore(); //thunk middleware

export default class index extends Component {
  render() {
    return (
      <Router>
        <HeaderNav />
        <FlashMessageList />
        <Routes>
          <Route
            path="/mailbox"
            element={
              <Provider store={mailboxStore}>
                <VAPP />
              </Provider>
            }
          ></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/" element={<SignInPage />}></Route>
        </Routes>
      </Router>
    );
  }
}
